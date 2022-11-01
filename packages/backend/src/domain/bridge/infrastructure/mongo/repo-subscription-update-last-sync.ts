import { map, TaskEither, tryCatch } from "fp-ts/lib/TaskEither"
import { constVoid, pipe } from "fp-ts/lib/function"

import { SubscriptionId } from "@tob/backend/src/domain/common"

import { RepoProfileSubscription } from "./repo-profile-subscription"

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
