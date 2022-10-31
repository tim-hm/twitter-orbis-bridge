import {
    getEnvVarOrDefault,
    getEnvVar,
    EnvVarName,
} from "@tob/common/src/utils/env-utils"

export const Config = {
    App: getEnvVarOrDefault(EnvVarName.AppName, "app"),
    HdWalletMnemonic: getEnvVar(EnvVarName.HdWalletMnemonic),
    LoggingLevel: getEnvVarOrDefault(EnvVarName.LoggingLevel, "info"),
    InfuraApiKey: getEnvVar(EnvVarName.InfuraApiKey),
    Name: getEnvVarOrDefault(EnvVarName.Env, "production"),
    Port: getEnvVarOrDefault(EnvVarName.Port, "8080"),
    TwitterApi: {
        Key: getEnvVar(EnvVarName.TwitterApiKey),
        Secret: getEnvVar(EnvVarName.TwitterApiSecret),
        Token: getEnvVar(EnvVarName.TwitterApiToken),
    },
}

export type Config = typeof Config
