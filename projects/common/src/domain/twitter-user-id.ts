import { z } from "zod"

export const TwitterUserId = z.string().brand<"TwitterUserId">()

export type TwitterUserId = z.infer<typeof TwitterUserId>
