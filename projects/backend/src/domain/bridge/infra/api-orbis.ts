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

const TOB_STREAM_ID =
    "kjzl6cwe1jw14b9lvf7vpuhlt32dmmf54587ta9xa8jrixfrk33iwy5b03sa7wz/kjzl6cwe1jw147lwtwid8rh3asrxqimgvmelxgoovm0agja2lo5s1mhqgk7klk9"

function push(tweets: Tweet[]): TaskEither<Error, number> {
    return tryCatch(
        async () => {
            const provider = new ethers.providers.InfuraProvider(
                "homestead",
                Config.InfuraApiKey,
            )
            // const orbis = new Orbis()
            // await orbis.connect(provider, false)

            // for (const tweet of tweets) {
            //     await orbis.createPost({
            //         body: tweet.body,
            //         title: "From Twitter",
            //         context: TOB_STREAM_ID,
            //     })
            // }

            return tweets.length
        },
        (cause) => {
            return new Error("push", { cause })
        },
    )
}
