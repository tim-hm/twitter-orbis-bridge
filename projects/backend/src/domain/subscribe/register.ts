import { App } from "@tob/backend/src/app/app"
import { Path } from "@tob/backend/src/app/path"

import { subscribeRestController } from "./controller/rest-subscribe"

export function registerSubscribeContext(app: App): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.express.use(Path.subscribe, subscribeRestController)
}
