import parseISO from "date-fns/parseISO"
import { option } from "fp-ts"
import { Option } from "fp-ts/Option"
import { z, ZodEffects } from "zod"

export const DateSchema = {
    FromString: z.preprocess((arg: unknown) => {
        if (typeof arg === "string") {
            return parseISO(arg)
        }
    }, z.date()),
    FromNumber: z.preprocess((arg: unknown) => {
        const number = Number(arg)
        if (number >= 0) {
            return new Date(number)
        }
    }, z.date()),
    Optional: z.preprocess((arg: unknown) => {
        if (typeof arg === "string") {
            const date = parseISO(arg)
            return option.some(date)
        } else {
            return option.none
        }
        // eslint-disable-next-line
        // @ts-ignore
    }, z.any()) as unknown as ZodEffects<unknown, Option<Date>, unknown>,
}
