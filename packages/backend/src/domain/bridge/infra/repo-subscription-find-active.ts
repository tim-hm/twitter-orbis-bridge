import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"

import { RepoProfileSubscription } from "./repo-profile-subscription"

import { Subscription } from "@tob/common/src/domain/profile-subscription"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"

export function findActive(
    userId: TwitterUserId,
): TaskEither<Error, Subscription[]> {
    return tryCatch(
        async () => {
            const result = await RepoProfileSubscription.find({
                active: true,
            }).lean()
            return result
        },
        (cause: unknown) => new Error("findActive", { cause }),
    )
}
