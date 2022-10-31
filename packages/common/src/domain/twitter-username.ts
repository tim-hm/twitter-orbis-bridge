import { z } from "zod"

export const TwitterUsername = z.string().brand<"TwitterUsername">()

export type TwitterUsername = z.infer<typeof TwitterUsername>
