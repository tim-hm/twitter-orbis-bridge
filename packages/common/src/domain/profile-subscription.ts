import { z } from "zod"

import { TwitterUserId } from "./twitter-user-id"
import { TwitterUsername } from "./twitter-username"

import { ProfileSubscriptionId } from "@tob/common/src/domain/profile-subscription-id"
import { DateSchema } from "@tob/common/src/zod/date-schema"

export const ProfileSubscription = z.object({
    _id: ProfileSubscriptionId,
    active: z.boolean(),
    lastSync: DateSchema.FromString,
    userId: TwitterUserId,
    username: TwitterUsername,
})

export type ProfileSubscription = z.infer<typeof ProfileSubscription>
