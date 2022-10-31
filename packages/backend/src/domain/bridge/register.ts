import { mirrorProfileRestController } from "./inter/rest-mirror-profile"
import { toggleSyncRestController } from "./inter/rest-toggle-sync"

import { App } from "@tob/backend/src/app/app"
import { Path } from "@tob/backend/src/app/path"
import { forceSyncRestController } from "@tob/backend/src/domain/bridge/inter/rest-force-sync"

export function registerSubscribeContext(app: App): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.express.post(Path.mirrorProfile, mirrorProfileRestController)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.express.use(Path.syncToggle, toggleSyncRestController)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.express.use(Path.syncForce, forceSyncRestController)
}
