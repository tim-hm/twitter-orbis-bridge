import { Request, Response } from "express"
import { task, taskEither } from "fp-ts"
import { pipe } from "fp-ts/lib/function"

import { ServiceBridge } from "@tob/backend/src/domain/bridge/mod"
import { ProfileSubscriptionId } from "@tob/backend/src/domain/common"
import { ZodSchemaUtil } from "@tob/backend/src/utils/zod/zod-schema-util"

export async function profileRefreshRestController(
    req: Request<{ id: string }>,
    res: Response<{ id: ProfileSubscriptionId }>,
): Promise<void> {
    const program = pipe(
        ZodSchemaUtil.parseToTaskEither(ProfileSubscriptionId, req.body.id),
        taskEither.chainW(ServiceBridge.profileRefresh),
        taskEither.fold((error) => {
            throw error
        }, task.of),
    )

    const subscription = await program()

    res.json({ id: subscription }).send()
}
