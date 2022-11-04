import secondsToMilliseconds from "date-fns/secondsToMilliseconds/index"
import { task, taskEither } from "fp-ts"
import { map, none, Option, some } from "fp-ts/lib/Option"
import { constVoid, pipe } from "fp-ts/lib/function"

import { Constant } from "@tob/backend/src/constant/constant"
import { Log } from "@tob/backend/src/domain/bridge/log"
import { ServiceBridge } from "@tob/backend/src/domain/bridge/mod"

let timerOpt: Option<NodeJS.Timer>
let running = false

export function timerToggleSync(): boolean {
    if (running) {
        running = false
        pipe(timerOpt, map(clearInterval))
        timerOpt = none
    } else {
        running = true

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const timer = setInterval(async (): Promise<void> => {
            const program = pipe(
                ServiceBridge.sync(),
                taskEither.foldW((error) => {
                    Log.error("Sync timer run failed because: %o", error)
                    return task.of(constVoid())
                }, task.of),
            )

            const results = await program()
            Log.info("Sync complete: %o", results)
        }, secondsToMilliseconds(Constant.SyncIntervalInSeconds))

        timerOpt = some(timer)
    }

    return running
}
