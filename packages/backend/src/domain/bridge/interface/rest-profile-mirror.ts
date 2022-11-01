import { Request, Response } from "express"
import { task, taskEither } from "fp-ts"
import { pipe } from "fp-ts/lib/function"

import { ServiceBridge } from "@tob/backend/src/domain/bridge/mod"
import { ProfileMirrorCreateRequest } from "@tob/backend/src/domain/bridge/service/uc-profile-mirror"
import { ZodSchemaUtil } from "@tob/backend/src/utils/zod/zod-schema-util"
import { ProfileSubscriptionId } from "@tob/backend/src/domain/common"

export async function profileMirrorRestController(
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
