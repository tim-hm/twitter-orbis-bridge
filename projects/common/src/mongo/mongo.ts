import mongoose, { Collection, Document } from "mongoose"

import { getEnvVar, EnvVarName } from "@tob/common/src/utils/env-utils"
import { getAppLogger } from "@tob/common/src/utils/log-utils"

const Log = getAppLogger("common.mongo")

export class Mongo {
    #uri: string = getEnvVar(EnvVarName.MongoUri)
    #client: mongoose.Mongoose | undefined = undefined

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    client(): mongoose.Mongoose {
        if (!this.#client) {
            throw "client is undefined"
        }
        return this.#client
    }

    async start(): Promise<void> {
        this.#client = await mongoose.connect(this.#uri, {
            bufferCommands: false,
            autoIndex: true,
        })
        Log.debug("connected")
    }

    async stop(): Promise<void> {
        await mongoose.disconnect()
        Log.debug("disconnected")
    }

    collection<T extends Document>(name: string): Collection<T> {
        return this.client().connection.collection<T>(name)
    }

    private static instance: Mongo | undefined

    static get(): Mongo {
        if (!Mongo.instance) {
            Mongo.instance = new Mongo()
        }
        return Mongo.instance
    }
}
