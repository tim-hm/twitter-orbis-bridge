import { NextFunction, Request, Response } from "express"

import { Log } from "@tob/backend/src/utils/log-utils"

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    if (err instanceof Error) {
        Log.error(err.message)
        Log.error(err.stack)
        Log.error(err.cause)
    } else if (typeof err === "object") {
        Log.error("Server error: %j", err)
    } else {
        Log.error("Server error: %s", err)
    }
    res.sendStatus(500)
}
