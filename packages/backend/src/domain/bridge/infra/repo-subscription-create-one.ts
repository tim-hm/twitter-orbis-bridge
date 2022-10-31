import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither.js"

import { SubscriptionId } from "@tob/common/src/domain/subscription-id.js"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id.js"

import { RepoSubscription } from "./repo-subscription.js"

export function createOne(
    userId: TwitterUserId,
): TaskEither<Error, SubscriptionId> {
    return tryCatch(
        async () => {
            const result = await RepoSubscription.create({ userId })
            return result._id
        },
        (cause: unknown) => new Error("createOne", { cause }),
    )
}
