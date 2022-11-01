import { z } from "zod"

import { TwitterUsername } from "./twitter-username"

export const Tweet = z.object({
    user: TwitterUsername,
    body: z.string(),
    created: z.string(),
})

export type Tweet = z.infer<typeof Tweet>
