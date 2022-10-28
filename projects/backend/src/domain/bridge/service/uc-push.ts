import { TaskEither } from "fp-ts/lib/TaskEither"

import { SubscriptionId } from "@tob/common/src/domain/subscription-id"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"

export type SubscribeResult = {
    subscription: SubscriptionId
    user: TwitterUserId
}

export function push(): TaskEither<Error, number> {
    throw "push"
}
