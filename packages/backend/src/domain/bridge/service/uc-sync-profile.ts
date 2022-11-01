import { TaskEither, map, chain } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"
import { z } from "zod"

import { RepoProfileSubscription } from "@tob/backend/src/domain/bridge/infrastructure/mongo/repo-profile-subscription"
import { ProfileSubscriptionId } from "@tob/backend/src/domain/common/profile-subscription-id"
import { TwitterUserId } from "@tob/backend/src/domain/common/twitter-user-id"
import { TwitterUsername } from "@tob/backend/src/domain/common/twitter-username"

import { ApiOrbis } from "../infrastructure/api-orbis"
import { ApiTwitter } from "../infrastructure/api-twitter"

export function refreshProfile(
    id: ProfileSubscriptionId,
): TaskEither<Error, string> {
    return pipe(
        RepoProfileSubscription.findByIdToTE(id),
        ApiTwitter.pullProfile,
        chain(ApiOrbis.updateProfile),
        map((subscription) => subscription._id),
    )
}

export const CreateMirrorProfileRequest = z.object({
    userId: TwitterUserId,
    username: TwitterUsername,
})

export type CreateMirrorProfileRequest = z.infer<
    typeof CreateMirrorProfileRequest
>
