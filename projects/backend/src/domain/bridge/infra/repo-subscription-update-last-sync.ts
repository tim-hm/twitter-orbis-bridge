import { map, TaskEither, tryCatch } from "fp-ts/lib/TaskEither"
import { constVoid, pipe } from "fp-ts/lib/function"

import { SubscriptionId } from "@tob/common/src/domain/subscription-id"

import { RepoSubscription } from "./repo-subscription"

export function updateLastSync(_id: SubscriptionId): TaskEither<Error, void> {
    return pipe(
        tryCatch(
            async () =>
                await RepoSubscription.findByIdAndUpdate(_id, {
                    lastSync: new Date(),
                }),
            (cause: unknown) => new Error("findActive", { cause }),
        ),
        map(constVoid),
    )
}
