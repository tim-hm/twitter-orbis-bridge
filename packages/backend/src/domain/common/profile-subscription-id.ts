import { Types } from "mongoose"
import { z } from "zod"

export const ProfileSubscriptionId = z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
        message: "ProfileSubscriptionId must be a valid ObjectId",
    })
    .transform((value) => new Types.ObjectId(value))
    .brand<"ProfileSubscriptionId">()

export type ProfileSubscriptionId = z.infer<typeof ProfileSubscriptionId>
