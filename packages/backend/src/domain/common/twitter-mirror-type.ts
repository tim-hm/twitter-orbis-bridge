import { z } from "zod"

export const TwitterMirrorType = z.enum(["Profile", "Hashtag"])

export type TwitterMirrorType = z.infer<typeof TwitterMirrorType>
