import { z } from "zod"

import { ProfileSubscriptionId } from "@tob/backend/src/domain/common/profile-subscription-id"
import { DateSchema } from "@tob/backend/src/utils/zod/date-schema"

import { TwitterUserId } from "./twitter-user-id"
import { TwitterUsername } from "./twitter-username"

export const ProfileSubscription = z.object({
    _id: ProfileSubscriptionId,
    active: z.boolean(),
    lastSync: DateSchema.FromString,
    userId: TwitterUserId,
    username: TwitterUsername,
    privateKey: z.string(),
})

export type ProfileSubscription = z.infer<typeof ProfileSubscription>
