import { TaskEither } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"
import { z } from "zod"

import { RepoProfileSubscription } from "@tob/backend/src/domain/bridge/infra/repo-profile-subscription"
import { ProfileSubscriptionId } from "@tob/common/src/domain/profile-subscription-id"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"
import { TwitterUsername } from "@tob/common/src/domain/twitter-username"

export function mirrorProfile(
    params: CreateMirrorProfileRequest,
): TaskEither<Error, ProfileSubscriptionId> {
    return pipe(RepoProfileSubscription.createOne(params))
}

export const CreateMirrorProfileRequest = z.object({
    userId: TwitterUserId,
    username: TwitterUsername,
})

export type CreateMirrorProfileRequest = z.infer<
    typeof CreateMirrorProfileRequest
>
