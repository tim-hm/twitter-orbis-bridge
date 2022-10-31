import secondsToMilliseconds from "date-fns/secondsToMilliseconds/index.js"
import { none, map, Option, some } from "fp-ts/lib/Option.js"
import { of } from "fp-ts/lib/Task.js"
import { fold } from "fp-ts/lib/TaskEither.js"
import { pipe } from "fp-ts/lib/function.js"

import { Log } from "@tob/backend/src/domain/bridge/log.js"
import { ServiceBridge } from "@tob/backend/src/domain/bridge/mod.js"
import { Constant } from "@tob/common/src/constant/constant.js"

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
