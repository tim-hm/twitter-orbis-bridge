import { Types } from "mongoose"
import { z } from "zod"

export const SubscriptionId = z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
        message: "SubscriptionId must be a valid ObjectId",
    })
    .transform((value) => new Types.ObjectId(value))
    .brand<"SubscriptionId">()

export type SubscriptionId = z.infer<typeof SubscriptionId>
