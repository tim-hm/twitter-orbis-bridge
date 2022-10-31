import { Request, Response } from "express"
import { task, taskEither } from "fp-ts"
import { pipe } from "fp-ts/lib/function.js"

import { ServiceBridge } from "@tob/backend/src/domain/bridge/mod.js"
import { SubscribeResult } from "@tob/backend/src/domain/bridge/service/uc-subscribe.js"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id.js"
import { ZodSchemaUtil } from "@tob/common/src/zod/zod-schema-util.js"

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
