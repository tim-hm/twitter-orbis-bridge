import secondsToMilliseconds from "date-fns/secondsToMilliseconds/index"
import { none, map, Option, some } from "fp-ts/lib/Option"
import { of } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

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
                fold((error) => {
                    throw error
                }, of),
            )

            const results = await program()
            Log.info("Sync complete: %o", results)
        }, secondsToMilliseconds(Constant.SyncIntervalInSeconds))

        timerOpt = some(timer)
    }

    return running
}
