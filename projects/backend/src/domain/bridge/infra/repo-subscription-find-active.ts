import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"

import { Subscription } from "@tob/common/src/domain/subscription"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"

import { RepoSubscription } from "./repo-subscription"

export function findActive(
    userId: TwitterUserId,
): TaskEither<Error, Subscription[]> {
    return tryCatch(
        async () => await RepoSubscription.find({ active: true }).lean(),
        (cause: unknown) => new Error("findActive", { cause }),
    )
}
