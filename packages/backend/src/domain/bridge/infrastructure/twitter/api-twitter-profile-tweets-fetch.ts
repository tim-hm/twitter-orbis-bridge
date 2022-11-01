import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"
import { Client } from "twitter-api-sdk"

import { Config } from "@tob/backend/src/config"
import { Log } from "@tob/backend/src/domain/bridge/log"
import {
    ProfileSubscription,
    Tweet,
    TwitterUsername,
} from "@tob/backend/src/domain/common"

export function profileTweetsFetch(
    subscription: ProfileSubscription,
): TaskEither<Error, Tweet[]> {
    return pipe(
        tryCatch(
            async () => {
                const client = new Client(Config.TwitterApi.Token)
                const { userId, lastSync, username } = subscription
                Log.debug(
                    "Fetching tweets for %s since %s",
                    username,
                    lastSync.toISOString(),
                )

                const response = await client.tweets.usersIdTweets(userId, {
                    start_time: lastSync.toISOString(),
                    max_results: 100,
                    "tweet.fields": ["created_at"],
                })

                if (response.errors) throw response.errors

                const { data } = response

                Log.debug("Got %s tweets for %s", data?.length ?? 0, username)

                if (data) {
                    return data.map((raw) => parseTweet(username, raw))
                } else {
                    return []
                }
            },
            (cause) => new Error("profileTweetsFetch", { cause }),
        ),
    )
}

function parseTweet(
    username: TwitterUsername,
    data: Record<string, unknown>,
): Tweet {
    const raw = {
        id: data["id"],
        username,
        text: data["text"],
        created: data["created_at"],
    }

    return Tweet.parse(raw)
}
