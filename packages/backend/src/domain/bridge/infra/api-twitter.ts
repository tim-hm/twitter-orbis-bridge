import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"
import { Client } from "twitter-api-sdk"

import { Config } from "@tob/backend/src/config"
import { Log } from "@tob/backend/src/domain/bridge/log"
import { ProfileSubscription } from "@tob/common/src/domain/profile-subscription"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"

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
    pullProfile,
}

function pullProfile(
    subscription: ProfileSubscription,
): TaskEither<Error, Tweet[]> {
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
