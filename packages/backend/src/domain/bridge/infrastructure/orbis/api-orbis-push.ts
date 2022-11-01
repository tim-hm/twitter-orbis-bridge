import { CreatePostContent } from "@orbisclub/orbis-sdk"
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"

import { Constant } from "@tob/backend/src/constant/constant"
import { Log } from "@tob/backend/src/domain/bridge/log"
import { Tweet } from "@tob/backend/src/domain/common"
import { OrbisWrapper } from "@tob/backend/src/utils/orbis-wrapper"

export function push(
    privateKey: string,
    tweets: Tweet[],
): TaskEither<Error, number> {
    return tryCatch(
        async () => {
            const orbis = OrbisWrapper.from(privateKey)
            const client = await orbis.connect()

            const posts = tweets.map(tweetToPost)
            const promises = posts.map((content) => client.createPost(content))
            await Promise.all(promises)

            Log.info("Pushed: %o", posts)

            await orbis.disconnect()
            return tweets.length
        },
        (cause) => new Error("push", { cause }),
    )
}

function tweetToPost(tweet: Tweet): CreatePostContent {
    return {
        body: `${tweet.text}
---
created: ${tweet.created.toISOString()}
source: https://twitter.com/${tweet.username}/status/${tweet.id}
`,
        context: Constant.OrbisChannelId,
    }
}
