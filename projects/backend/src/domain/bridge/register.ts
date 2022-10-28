import { App } from "@tob/backend/src/app/app"
import { Path } from "@tob/backend/src/app/path"

import { runSyncRestController } from "./inter/rest-run-sync"
import { subscribeRestController } from "./inter/rest-subscribe"

export function registerSubscribeContext(app: App): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.express.use(Path.subscribe, subscribeRestController)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.express.use(Path.sync, runSyncRestController)
}
