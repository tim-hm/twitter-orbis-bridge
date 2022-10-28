import { map, TaskEither } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { RepoSubscription } from "@tob/backend/src/domain/subscribe/infra/repo-subscription"
import { SubscriptionId } from "@tob/common/src/domain/subscription-id"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"

export type RegisterResult = {
    subscription: SubscriptionId
    user: TwitterUserId
}

export function register(
    user: TwitterUserId,
): TaskEither<Error, RegisterResult> {
    return pipe(
        RepoSubscription.createOne(user),
        map((subscription) => ({ subscription, user })),
    )
}
