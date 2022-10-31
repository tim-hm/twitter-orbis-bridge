import { z } from "zod"

import { HashtagSubscriptionId } from "@tob/common/src/domain/hastag-subscription-id"
import { DateSchema } from "@tob/common/src/zod/date-schema"

export const HashtagSubscription = z.object({
    _id: HashtagSubscriptionId,
    active: z.boolean(),
    lastSync: DateSchema.FromString,
    hashtag: z.string(),
})

export type HashtagSubscription = z.infer<typeof HashtagSubscription>
