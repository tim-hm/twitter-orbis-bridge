import { App } from "@tob/backend/src/app/app.js"
import { Path } from "@tob/backend/src/app/path.js"

import { runSyncRestController } from "./inter/rest-run-sync.js"
import { subscribeRestController } from "./inter/rest-subscribe.js"

export function registerSubscribeContext(app: App): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.express.use(Path.subscribe, subscribeRestController)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.express.use(Path.sync, runSyncRestController)
}
