import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"
import { Client } from "twitter-api-sdk"

import { Config } from "@tob/backend/src/config"
import { Log } from "@tob/backend/src/main"
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
    pull,
}

function pull(params: Params[]): TaskEither<Error, Tweet[]> {
    const client = new Client(Config.TwitterApi.Token)

    return pipe(
        tryCatch(
            async () => {
                Log.info("Running tweet sync")

                const { user, since } = params[0]

                const tweets = await client.tweets.usersIdTweets(user, {
                    start_time: since.toISOString(),
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
