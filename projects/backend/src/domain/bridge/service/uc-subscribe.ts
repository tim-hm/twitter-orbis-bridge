import { map, TaskEither } from "fp-ts/lib/TaskEither.js"
import { pipe } from "fp-ts/lib/function.js"

import { RepoSubscription } from "@tob/backend/src/domain/bridge/infra/repo-subscription.js"
import { SubscriptionId } from "@tob/common/src/domain/subscription-id.js"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id.js"

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
