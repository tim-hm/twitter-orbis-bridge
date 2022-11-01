import { App } from "@tob/backend/src/app/app"
import { Path } from "@tob/backend/src/app/path"
import { forceSyncRestController } from "@tob/backend/src/domain/bridge/interface/rest-sync-force"

import { profileMirrorRestController } from "./interface/rest-profile-mirror"
import { profileRefreshRestController } from "./interface/rest-profile-refresh"
import { toggleSyncRestController } from "./interface/rest-toggle-sync"

export function registerSubscribeContext(app: App): void {
    app.express.post(Path.profileMirror, profileMirrorRestController)
    app.express.use(Path.profileRefresh, profileRefreshRestController)

    app.express.use(Path.syncToggle, toggleSyncRestController)
    app.express.use(Path.syncForce, forceSyncRestController)
}
