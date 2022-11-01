import { Server as HttpServer } from "node:http"

import compression from "compression"
import * as Express from "express"
import helmet from "helmet"
import morgan from "morgan"

import { Config } from "@tob/backend/src/config"
import { registerSubscribeContext } from "@tob/backend/src/domain/bridge/register"
import { errorHandler } from "@tob/backend/src/utils/express/error-handler"
import { Mongo } from "@tob/backend/src/utils/mongo"

import { Log } from "./log"

export class App {
    #mongo = Mongo.get()
    #http: HttpServer | undefined

    express = Express.default()

    constructor(private config: Config) {}

    // eslint-disable-next-line @typescript-eslint/require-await
    async init(): Promise<void> {
        await this.#mongo.start()

        this.setupCommonMiddleware()
        this.buildContexts()
        this.setupAfterware()

        Log.info("initialized")
    }

    private setupCommonMiddleware(): void {
        const stream = {
            write: (message: string) => Log.debug(message.trimEnd()),
        }
        this.express.use(morgan("dev", { stream }))

        this.express.use(helmet())
        this.express.use(compression())
        this.express.use(Express.json())
        this.express.use(Express.text())
    }

    private buildContexts(): void {
        registerSubscribeContext(this)
    }

    private setupAfterware(): void {
        this.express.use(errorHandler)
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async start(): Promise<void> {
        const { Port } = this.config
        this.#http = this.express.listen(Port)
        Log.info("listening on port %d", Port)

        Log.info("started")
    }

    async stop(): Promise<void> {
        await this.#mongo.stop()
        this.#http?.close()

        Log.info("stopped")
    }
}
