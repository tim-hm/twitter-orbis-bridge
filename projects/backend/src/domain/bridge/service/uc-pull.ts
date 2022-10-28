import { taskEither } from "fp-ts"
import { TaskEither } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { ApiTwitter } from "@tob/backend/src/domain/bridge/infra/api-twitter"
import { RepoSubscription } from "@tob/backend/src/domain/bridge/infra/repo-subscription"
import { Subscription } from "@tob/common/src/domain/subscription"
import { SubscriptionId } from "@tob/common/src/domain/subscription-id"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"

export type SubscribeResult = {
    subscription: SubscriptionId
    user: TwitterUserId
}

export function pull(): TaskEither<Error, number> {
    return pipe(
        RepoSubscription.findActive(),
        taskEither.chain((subscriptions: Subscription[]) => {
            const first = subscriptions[0]
            const params = [{ user: first.userId, since: first.lastSync }]

            return ApiTwitter.pull(params)
        }),
        taskEither.map((tweets) => tweets.length),
    )
}
