import { Request, Response } from "express"

import { timerToggleSync } from "./timer-run-sync.js"

export function runSyncRestController(
    req: Request<{ id: string }>,
    res: Response<{ running: boolean }>,
): void {
    const running = timerToggleSync()

    res.json({ running }).send()
}
