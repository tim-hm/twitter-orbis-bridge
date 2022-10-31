import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"

import { RepoProfileSubscription } from "./repo-profile-subscription"

import { CreateMirrorProfileRequest } from "@tob/backend/src/domain/bridge/service/uc-mirror-profile"
import { ProfileSubscriptionId } from "@tob/common/src/domain/profile-subscription-id"

export function createOne(
    params: CreateMirrorProfileRequest,
): TaskEither<Error, ProfileSubscriptionId> {
    return tryCatch(
        async () => {
            const result = await RepoProfileSubscription.create({
                userId: params.userId,
                username: params.username,
            })
            return result._id
        },
        (cause: unknown) => new Error("createOne", { cause }),
    )
}
