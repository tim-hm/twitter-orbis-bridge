import { z } from "zod"

import { DateSchema } from "@tob/backend/src/utils/zod/date-schema"

import { TweetId } from "./tweet-id"
import { TwitterUsername } from "./twitter-username"

export const Tweet = z.object({
    id: TweetId,
    username: TwitterUsername,
    text: z.string(),
    created: DateSchema.FromString,
})

export type Tweet = z.infer<typeof Tweet>
