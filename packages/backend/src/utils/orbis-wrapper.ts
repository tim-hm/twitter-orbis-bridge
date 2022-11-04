import { Orbis } from "@orbisclub/orbis-sdk"
import { ethers } from "ethers"
import Store from "store2"

import { Config } from "@tob/backend/src/config"

import { EthUtils } from "./eth-utils"

export type OrbisWrapperOptions = {
    walletKey: Uint8Array
    apiKey: string
}

export class OrbisWrapper {
    private client: Orbis
    private provider: ethers.providers.InfuraProvider
    private wallet: ethers.Wallet

    constructor(options: OrbisWrapperOptions) {
        this.client = new Orbis()
        this.wallet = new ethers.Wallet(options.walletKey)
        this.provider = new ethers.providers.InfuraProvider(
            "homestead",
            options.apiKey,
        )
    }

    getClient(): Orbis {
        return this.client
    }

    async connect(): Promise<Orbis> {
        this.addBrowserShims()
        const res = await this.client.connect(this.provider, false)
        if (res.error) throw res.error

        return this.client
    }

    private addBrowserShims(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.provider.enable = async (): Promise<string[]> => {
            const address = await this.wallet.getAddress()
            return [address]
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.provider.request = async (args: {
            method: string
            params: unknown[]
        }) => {
            const { method, params } = args
            if (method === "personal_sign") {
                const message = params[0] as unknown as string
                const result = await this.wallet.signMessage(message)
                return result
            } else {
                const result = await this.provider.send(
                    args.method,
                    args.params,
                )
                return result
            }
        }

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
            removeItem: (key: string) => Store.remove(key),
        }
    }

    async disconnect(): Promise<void> {
        const res = await this.client.logout()
        if (res.error) throw res.error

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.localStorage = undefined
    }

    static from(keyData: string): OrbisWrapper {
        const walletKey = EthUtils.toKey(keyData)
        const apiKey = Config.InfuraApiKey

        return new OrbisWrapper({ walletKey, apiKey })
    }
}
