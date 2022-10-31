import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither.js"

import { Subscription } from "@tob/common/src/domain/subscription.js"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id.js"

import { RepoSubscription } from "./repo-subscription.js"

export function findActive(
    userId: TwitterUserId,
): TaskEither<Error, Subscription[]> {
    return tryCatch(
        async () => {
            const result = await RepoSubscription.find({ active: true }).lean()
            return result
        },
        (cause: unknown) => new Error("findActive", { cause }),
    )
}
