import { Request, Response } from "express"
import { taskEither, task } from "fp-ts"
import { pipe } from "fp-ts/lib/function"

import { ServiceBridge } from "@tob/backend/src/domain/bridge/mod"

export async function pushRestController(
    req: Request<{ id: string }>,
    res: Response,
): Promise<void> {
    const program = pipe(
        ServiceBridge.push(),
        taskEither.foldW((error) => {
            throw error
        }, task.of),
    )

    const result = await program()
    res.send(result)
}
;``
