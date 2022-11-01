import { taskEither } from "fp-ts"
import { ZodError, ZodSchema, ZodTypeDef } from "zod"

export const ZodSchemaUtil = {
    parseToTaskEither: function <Output, Input = unknown>(
        schema: ZodSchema<Output, ZodTypeDef, Input>,
        data: Input,
    ): taskEither.TaskEither<ZodError, Output> {
        const result = schema.safeParse(data)
        return result.success
            ? taskEither.right(result.data)
            : taskEither.left(result.error)
    },
}
