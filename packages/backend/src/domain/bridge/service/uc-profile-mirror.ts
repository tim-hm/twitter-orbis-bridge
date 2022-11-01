import { taskEither } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import { z } from "zod"

import {
    ApiOrbis,
    ApiTwitter,
} from "@tob/backend/src/domain/bridge/infrastructure"
import { RepoProfileSubscription } from "@tob/backend/src/domain/bridge/infrastructure/mongo/repo-profile-subscription"
import { ProfileSubscriptionId } from "@tob/backend/src/domain/common/profile-subscription-id"
import { TwitterUserId } from "@tob/backend/src/domain/common/twitter-user-id"
import { TwitterUsername } from "@tob/backend/src/domain/common/twitter-username"

export function profileMirror(
    params: ProfileMirrorCreateRequest,
): taskEither.TaskEither<Error, ProfileSubscriptionId> {
    return pipe(
        taskEither.Do,
        taskEither.bind("subscription", () =>
            RepoProfileSubscription.createOne(params),
        ),
        taskEither.bind("profile", ({ subscription }) =>
            ApiTwitter.profileFetch(subscription),
        ),
        taskEither.chain(ApiOrbis.profileUpdate),
        taskEither.map((subscription) => subscription._id),
    )
}

export const ProfileMirrorCreateRequest = z.object({
    userId: TwitterUserId,
    username: TwitterUsername,
})

export type ProfileMirrorCreateRequest = z.infer<
    typeof ProfileMirrorCreateRequest
>
