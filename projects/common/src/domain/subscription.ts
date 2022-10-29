import { z } from "zod"

import { DateSchema } from "@tob/common/src/zod/date-schema"

import { SubscriptionId } from "./subscription-id.js"
import { TwitterUserId } from "./twitter-user-id.js"

export const Subscription = z.object({
    _id: SubscriptionId,
    active: z.boolean(),
    userId: TwitterUserId,
    lastSync: DateSchema.FromString,
})

export type Subscription = z.infer<typeof Subscription>
