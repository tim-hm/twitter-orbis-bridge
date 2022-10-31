import { Orbis } from "@orbisclub/orbis-sdk"
import { ethers } from "ethers"
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"
import Store from "store2"

import { Tweet } from "./api-twitter"

import { Config } from "@tob/backend/src/config"
import { Log } from "@tob/backend/src/domain/bridge/log"

export const ApiOrbis = {
    push,
}

const TOB_STREAM_ID =
    "kjzl6cwe1jw147lwtwid8rh3asrxqimgvmelxgoovm0agja2lo5s1mhqgk7klk9"

function push(tweets: Tweet[]): TaskEither<Error, number> {
    return tryCatch(
        async () => {
            const { provider, clearShims } = createProviderAndAddBrowserShim()

            const orbis = new Orbis()
            const res = await orbis.connect(provider, false)

            if (res.error) throw res.error

            for (const tweet of tweets) {
                const res = await orbis.createPost({
                    body: tweet.body,
                    title: "From Twitter",
                    context: TOB_STREAM_ID,
                })
                Log.info("%o", res)
            }

            clearShims()
            return tweets.length
        },
        (cause) => {
            return new Error("push", { cause })
        },
    )
}

function createProviderAndAddBrowserShim(): {
    provider: ethers.providers.InfuraProvider
    wallet: ethers.Wallet
    clearShims: () => void
} {
    const wallet = ethers.Wallet.fromMnemonic(Config.HdWalletMnemonic)
    const provider = new ethers.providers.InfuraProvider(
        "homestead",
        Config.InfuraApiKey,
    )
    wallet.connect(provider)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    provider.enable = async function (): Promise<string[]> {
        const address = await wallet.getAddress()
        return [address]
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    provider.request = async (args: { method: string; params: unknown[] }) => {
        const { method, params } = args
        if (method === "personal_sign") {
            const message = params[0] as unknown as string
            const result = await wallet.signMessage(message)
            return result
        } else {
            const result = await provider.send(args.method, args.params)
            return result
        }
    }

    createBrowserShim()

    return { provider, wallet, clearShims: clearBrowserShim }
}

function createBrowserShim(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.window = {
        location: {
            hostname: "app.orbis.club",
        },
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.localStorage = {
        getItem: (key: string) => Store.get(key),
        setItem: (key: string, data: string) => Store.set(key, data),
    }
}

function clearBrowserShim(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.localStorage = undefined
}
