import { env } from "node:process"

export const enum EnvVarName {
    AppName = "TOB_APP",
    Env = "NODE_ENV",
    LoggingLevel = "TOB_LOGGING_LEVEL",
    InfuraApiKey = "TOB_INFRA_API_KEY",
    MongoUri = "TOB_MONGO_URI",
    Port = "TOB_PORT",
    TwitterApiKey = "TOB_TWITTER_API_KEY",
    TwitterApiSecret = "TOB_TWITTER_API_SECRET",
    TwitterApiToken = "TOB_TWITTER_API_TOKEN",
}

export function getEnvVar(key: string): string {
    const value = env[key]
    if (value === undefined || value === null || value.trim().length === 0) {
        throw new Error(`Missing environment variable: ${key}`)
    }
    return value
}

export function getEnvVarOrDefault(key: string, fallback: string): string {
    return env[key] ?? fallback
}

export function getEnv(): Record<string, string> {
    const keys = Object.keys(process.env).filter((key) => key.startsWith("TOB"))

    const env: Record<string, string> = {}
    for (const key of keys) {
        env[key] = process.env[key] ?? "undefined"
    }

    return env
}
