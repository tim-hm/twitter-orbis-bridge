import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"

import { ProfileSubscription } from "@tob/backend/src/domain/common"
import { TwitterUserId } from "@tob/backend/src/domain/common"

import { RepoProfileSubscription } from "./repo-profile-subscription"

export function findActive(
    userId: TwitterUserId,
): TaskEither<Error, ProfileSubscription[]> {
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
