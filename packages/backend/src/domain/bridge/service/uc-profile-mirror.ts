import { chain, map, TaskEither } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"
import { z } from "zod"

import { ApiOrbis } from "@tob/backend/src/domain/bridge/infrastructure"
import { RepoProfileSubscription } from "@tob/backend/src/domain/bridge/infrastructure/mongo/repo-profile-subscription"
import { ProfileSubscriptionId } from "@tob/backend/src/domain/common/profile-subscription-id"
import { TwitterUserId } from "@tob/backend/src/domain/common/twitter-user-id"
import { TwitterUsername } from "@tob/backend/src/domain/common/twitter-username"

export function profileMirror(
    params: ProfileMirrorCreateRequest,
): TaskEither<Error, ProfileSubscriptionId> {
    return pipe(
        RepoProfileSubscription.createOne(params),
        chain(ApiOrbis.profileUpdate),
        map((subscription) => subscription._id),
    )
}

export const ProfileMirrorCreateRequest = z.object({
    userId: TwitterUserId,
    username: TwitterUsername,
})

export type ProfileMirrorCreateRequest = z.infer<
    typeof ProfileMirrorCreateRequest
>
