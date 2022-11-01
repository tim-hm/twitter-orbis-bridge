import { z } from "zod"

export const TweetId = z.string().brand<"TweetId">()

export type TweetId = z.infer<typeof TweetId>
