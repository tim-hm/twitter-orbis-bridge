import { map, TaskEither } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { RepoSubscription } from "@tob/backend/src/domain/bridge/infra/repo-subscription"
import { SubscriptionId } from "@tob/common/src/domain/subscription-id"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"

export type SubscribeResult = {
    subscription: SubscriptionId
    user: TwitterUserId
}

export function subscribe(
    user: TwitterUserId,
): TaskEither<Error, SubscribeResult> {
    return pipe(
        RepoSubscription.createOne(user),
        map((subscription) => ({ subscription, user })),
    )
}
