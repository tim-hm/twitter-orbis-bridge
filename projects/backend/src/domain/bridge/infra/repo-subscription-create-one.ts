import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"

import { SubscriptionId } from "@tob/common/src/domain/subscription-id"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"

import { RepoSubscription } from "./repo-subscription"

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
