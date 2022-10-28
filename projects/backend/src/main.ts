import { getAppLogger } from "@tob/common/src/utils/log-utils"

import { App } from "./app/app"
import { Config } from "./config"

export const Log = getAppLogger("main")

async function main(): Promise<void> {
    try {
        Log.info("starting service with config: %j", Config)

        const app = new App(Config)
        await app.init()
        await app.start()
    } catch (error) {
        Log.error("Uncaught exception: %j", error)
        // eslint-disable-next-line no-console
        console.error(error)
    }
}

void main()
