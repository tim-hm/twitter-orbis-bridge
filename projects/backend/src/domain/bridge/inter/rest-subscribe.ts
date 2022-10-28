import { Request, Response } from "express"
import { task, taskEither } from "fp-ts"
import { pipe } from "fp-ts/lib/function"

import { ServiceBridge } from "@tob/backend/src/domain/bridge/mod"
import { SubscribeResult } from "@tob/backend/src/domain/bridge/service/uc-subscribe"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"
import { ZodSchemaUtil } from "@tob/common/src/zod/zod-schema-util"

export async function subscribeRestController(
    req: Request<{ id: string }>,
    res: Response<SubscribeResult>,
): Promise<void> {
    const program = pipe(
        ZodSchemaUtil.parseToTaskEither(TwitterUserId, req.params.id),
        taskEither.chainW(ServiceBridge.subscribe),
        taskEither.fold((error) => {
            throw error
        }, task.of),
    )

    const result = await program()

    res.json(result).send()
}
