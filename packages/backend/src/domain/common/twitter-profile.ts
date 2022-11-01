import { z } from "zod"

import { TwitterUserId } from "./twitter-user-id"

export const TwitterProfile = z.object({
    id: TwitterUserId,
    username: TwitterUserId,
})

export type TwitterProfile = z.infer<typeof TwitterProfile>
