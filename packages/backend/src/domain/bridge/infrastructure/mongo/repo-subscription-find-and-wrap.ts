import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"

import {
    ProfileSubscriptionId,
    ProfileSubscription,
} from "@tob/backend/src/domain/common"

import { RepoProfileSubscription } from "./repo-profile-subscription"

export function findAndWrap(
    id: ProfileSubscriptionId,
): TaskEither<Error, ProfileSubscription> {
    return tryCatch(
        async () => {
            const result = await RepoProfileSubscription.findById(id).lean()
            return result as ProfileSubscription
        },
        (cause: unknown) => new Error("findActive", { cause }),
    )
}
