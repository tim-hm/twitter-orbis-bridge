import { map, TaskEither, tryCatch } from "fp-ts/lib/TaskEither"
import { constVoid, pipe } from "fp-ts/lib/function"

import { RepoProfileSubscription } from "./repo-profile-subscription"

import { SubscriptionId } from "@tob/common/src/domain/profile-subscription-id"

export function updateLastSync(_id: SubscriptionId): TaskEither<Error, void> {
    return pipe(
        tryCatch(
            async () =>
                await RepoProfileSubscription.findByIdAndUpdate(_id, {
                    lastSync: new Date(),
                }),
            (cause: unknown) => new Error("findActive", { cause }),
        ),
        map(constVoid),
    )
}
