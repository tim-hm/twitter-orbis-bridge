import { Request, Response } from "express"
import { taskEither } from "fp-ts"
import { identity, pipe } from "fp-ts/lib/function"

import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"
import { ZodSchemaUtil } from "@tob/common/src/zod/zod-schema-util"

import { ServiceSubscribe } from "../mod"

export async function subscribeRestController(
    req: Request<{ id: string }>,
    res: Response,
): Promise<void> {
    const program = pipe(
        ZodSchemaUtil.parseToTaskEither(TwitterUserId, req.params.id),
        taskEither.map(ServiceSubscribe.register),
        taskEither.fold((error) => {
            throw error
        }, identity),
    )

    const result = await program()
    res.send(result)
}
