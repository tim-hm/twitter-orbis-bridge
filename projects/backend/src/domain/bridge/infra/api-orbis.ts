// @ts-ignore
import { Orbis } from "@orbisclub/orbis-sdk"
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither.js"
import HDWalletProvider from "@truffle/hdwallet-provider"
import Web3 from "web3"
import ethers from "ethers"

import { Config } from "@tob/backend/src/config.js"

import { Tweet } from "./api-twitter.js"
import { Log } from "@tob/backend/src/domain/bridge/log.js"
// @ts-ignore
import { LocalStorage } from "node-localstorage"

export const ApiOrbis = {
    push,
}


const TOB_STREAM_ID = "kjzl6cwe1jw147lwtwid8rh3asrxqimgvmelxgoovm0agja2lo5s1mhqgk7klk9"

function push(tweets: Tweet[]): TaskEither<Error, number> {
    // @ts-ignore
    global.localStorage = new LocalStorage('./scratch');
    
    return tryCatch(
        async () => {
            const wallet = ethers.Wallet.fromMnemonic(Config.HdWalletMnemonic)
            const provider = new ethers.providers.InfuraProvider("homestead", Config.InfuraApiKey)
            wallet.connect(provider)

            // @ts-ignore
            provider.enable = async function(): Promise<string[]> {
                const address = await wallet.getAddress()
                return [address]
            }
            
            // @ts-ignore
            provider.request = async (args: {
                method: string,
                params: unknown[],
            }) => {
                const {method, params} = args
                if(method === "personal_sign") {
                    const message = params[0] as unknown as string
                    const result = await wallet.signMessage(message)
                    return result
                } else {
                    const result = await provider.send(args.method, args.params)
                    return result
                }
            }

            const orbis = new Orbis()
            const res = await orbis.connect(provider, false)

            if(res.error) throw res.error

            for (const tweet of tweets) {
                const res = await orbis.createPost({
                    body: tweet.body,
                    title: "From Twitter",
                    context: TOB_STREAM_ID,
                })
                Log.info("%o", res)
            }

            return tweets.length
        },
        (cause) => {
            return new Error("push", { cause })
        },
    )
}
