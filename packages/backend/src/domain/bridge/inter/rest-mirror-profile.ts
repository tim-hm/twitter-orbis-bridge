import { Request, Response } from "express"
import { task, taskEither } from "fp-ts"
import { pipe } from "fp-ts/lib/function"

import { ServiceBridge } from "@tob/backend/src/domain/bridge/mod"
import { CreateMirrorProfileRequest } from "@tob/backend/src/domain/bridge/service/uc-mirror-profile"
import { ProfileSubscriptionId } from "@tob/common/src/domain/profile-subscription-id"
import { ZodSchemaUtil } from "@tob/common/src/zod/zod-schema-util"

export async function mirrorProfileRestController(
    req: Request<{ userId: string; username: string }>,
    res: Response<{ id: ProfileSubscriptionId }>,
): Promise<void> {
    const program = pipe(
        ZodSchemaUtil.parseToTaskEither(CreateMirrorProfileRequest, req.body),
        taskEither.chainW(ServiceBridge.mirrorProfile),
        taskEither.fold((error) => {
            throw error
        }, task.of),
    )

    const subscription = await program()

    res.json({ id: subscription }).send()
}
