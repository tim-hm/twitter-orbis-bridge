import { z } from "zod"

import { DateSchema } from "@tob/common/src/zod/date-schema"

import { SubscriptionId } from "./subscription-id"
import { TwitterUserId } from "./twitter-user-id"

export const Subscription = z.object({
    _id: SubscriptionId,
    userId: TwitterUserId,
    lastSync: DateSchema.FromString,
})

export type Subscription = z.infer<typeof Subscription>
