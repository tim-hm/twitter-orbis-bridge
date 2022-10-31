import { map, TaskEither, tryCatch } from "fp-ts/lib/TaskEither.js"
import { constVoid, pipe } from "fp-ts/lib/function.js"

import { SubscriptionId } from "@tob/common/src/domain/subscription-id.js"

import { RepoSubscription } from "./repo-subscription.js"

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
