import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither.js"
import { pipe } from "fp-ts/lib/function.js"
import { Client } from "twitter-api-sdk"

import { Config } from "@tob/backend/src/config.js"
import { Log } from "@tob/backend/src/main.js"
import { Subscription } from "@tob/common/src/domain/subscription.js"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id.js"

export type Params = {
    user: TwitterUserId
    since: Date
}

export type Tweet = {
    user: string
    body: string
    created: string
}

export const ApiTwitter = {
    pull,
}

function pull(subscription: Subscription): TaskEither<Error, Tweet[]> {
    const client = new Client(Config.TwitterApi.Token)

    return pipe(
        tryCatch(
            async () => {
                Log.info("Running tweet sync")

                const { userId, lastSync } = subscription

                const tweets = await client.tweets.usersIdTweets(userId, {
                    start_time: lastSync.toISOString(),
                })

                if (tweets.data) {
                    return tweets.data.map((tweet) => {
                        return {
                            user: tweet.author_id ?? "",
                            body: tweet.text ?? "",
                            created: tweet.created_at ?? "",
                        }
                    })
                } else {
                    return []
                }
            },
            (cause) => new Error("pullTweets", { cause }),
        ),
    )
}
