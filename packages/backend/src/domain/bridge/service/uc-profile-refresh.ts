import { taskEither } from "fp-ts"
import { pipe } from "fp-ts/lib/function"

import {
    ApiOrbis,
    ApiTwitter,
} from "@tob/backend/src/domain/bridge/infrastructure"
import { RepoProfileSubscription } from "@tob/backend/src/domain/bridge/infrastructure/mongo/repo-profile-subscription"
import { ProfileSubscriptionId } from "@tob/backend/src/domain/common/profile-subscription-id"

export function profileRefresh(
    id: ProfileSubscriptionId,
): taskEither.TaskEither<Error, ProfileSubscriptionId> {
    return pipe(
        taskEither.Do,
        taskEither.bind("subscription", () =>
            RepoProfileSubscription.findAndWrap(id),
        ),
        taskEither.bind("profile", ({ subscription }) =>
            ApiTwitter.profileFetch(subscription),
        ),
        taskEither.chain(ApiOrbis.profileUpdate),
        taskEither.map((subscription) => subscription._id),
    )
}
