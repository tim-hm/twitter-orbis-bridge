import { Request, Response } from "express"
import { taskEither, task } from "fp-ts"
import { pipe } from "fp-ts/lib/function"

import { ServiceBridge } from "@tob/backend/src/domain/bridge/mod"
import { SyncResult } from "@tob/backend/src/domain/bridge/service/uc-sync"

export async function runSyncRestController(
    req: Request<{ id: string }>,
    res: Response<SyncResult>,
): Promise<void> {
    const program = pipe(
        ServiceBridge.sync(),
        taskEither.fold((error) => {
            throw error
        }, task.of),
    )

    const result = await program()
    res.json(result)
}
