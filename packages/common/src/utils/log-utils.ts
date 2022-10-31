import colors from "@colors/colors"
import * as winston from "winston"
import { Logger } from "winston"

import { EnvVarName, getEnvVar } from "./env-utils"

const formatter = winston.format.printf((params) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { level, message, label, timestamp } = params
    const group = colors.magenta(String(label))
    return `${String(timestamp)} ${group} ${level}: ${String(message)}`
})

const transports = [new winston.transports.Console()]

export function createWinstonLogger(name: string): winston.Logger {
    const level = getEnvVar(EnvVarName.LoggingLevel)

    return winston.createLogger({
        level,
        format: winston.format.combine(
            winston.format.label({ label: name }),
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.colorize(),
            formatter,
        ),
        transports,
        exitOnError: false,
    })
}

const appNamespace = getEnvVar(EnvVarName.AppName)
export const Log = createWinstonLogger(appNamespace)

export function getAppLogger(path = ""): Logger {
    if (path) {
        const instanceNamespace = `${appNamespace}.${path}`
        return createWinstonLogger(instanceNamespace)
    } else {
        return Log
    }
}
