import { Client } from "twitter-api-sdk"

import { Config } from "@tob/backend/src/config"

import { Log } from "../../../main"

export async function getTweets(): Promise<void> {
    const client = new Client(Config.TwitterApi.Token)

    const tweets = await client.tweets.usersIdTweets("1438853719", {
        start_time: "2022-10-27T12:00:00Z",
    })

    Log.info("%o", tweets)
}
