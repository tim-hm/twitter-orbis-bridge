import { z } from "zod"

import { DateSchema } from "@tob/backend/src/utils/zod/date-schema"

import { TwitterUserId } from "./twitter-user-id"

export const TwitterProfile = z.object({
    id: TwitterUserId,
    created: DateSchema.FromString,
    username: TwitterUserId,
    profileImage: z.string(),
})

export type TwitterProfile = z.infer<typeof TwitterProfile>
