import { Types } from "mongoose"
import { z } from "zod"

export const HashtagSubscriptionId = z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
        message: "HashtagSubscriptionId must be a valid ObjectId",
    })
    .transform((value) => new Types.ObjectId(value))
    .brand<"HashtagSubscriptionId">()

export type HashtagSubscriptionId = z.infer<typeof HashtagSubscriptionId>
