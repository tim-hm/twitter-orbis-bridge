import { Client } from "twitter-api-sdk"

import { Config } from "@tob/backend/src/config"

export const TwitterWrapper = {
    createClient: function () {
        return new Client(Config.TwitterApi.Token)
    },
}
