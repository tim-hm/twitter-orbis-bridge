import { z } from "zod"

import { DateSchema } from "@tob/backend/src/utils/zod/date-schema"

import { HashtagSubscriptionId } from "./hashtag-subscription-id"

export const HashtagSubscription = z.object({
    _id: HashtagSubscriptionId,
    active: z.boolean(),
    lastSync: DateSchema.FromString,
    hashtag: z.string(),
})

export type HashtagSubscription = z.infer<typeof HashtagSubscription>
