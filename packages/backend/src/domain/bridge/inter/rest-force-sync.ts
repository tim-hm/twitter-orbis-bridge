import {
    ServiceBridge,
} from "@tob/backend/src/domain/bridge/service/service-bridge"
import { SyncResult } from "@tob/backend/src/domain/bridge/service/uc-sync"
import { Request, Response } from "express"

import { pipe } from "fp-ts/function"
import { of } from "fp-ts/Task"
import { fold } from "fp-ts/TaskEither"

export async function forceSyncRestController(
    req: Request<{ id: string }>,
    res: Response<SyncResult>,
): Promise<void> {
    const program = pipe(
        ServiceBridge.sync(),
        fold((error) => {
            throw error
        }, of),
    )

    const results = await program()
    res.json(results).send()
}
