import { array, taskEither } from "fp-ts"
import { TaskEither } from "fp-ts/lib/TaskEither.js"
import { pipe } from "fp-ts/lib/function.js"

import { ApiOrbis } from "@tob/backend/src/domain/bridge/infra/api-orbis.js"
import { ApiTwitter } from "@tob/backend/src/domain/bridge/infra/api-twitter.js"
import { RepoSubscription } from "@tob/backend/src/domain/bridge/infra/repo-subscription.js"
import { Subscription } from "@tob/common/src/domain/subscription.js"

export type SyncResult = {
    pulled: number
    pushed: number
}

// This is a naive implementation because:
// 1 - running in sequence with adoption that would be too slow.
// 2 - Running in parallel without batches would consume too many resources.
export function sync(): TaskEither<Error, SyncResult> {
    return pipe(
        RepoSubscription.findActive(),
        taskEither.chain((subscriptions: Subscription[]) => {
            return pipe(
                subscriptions,
                array.map((subscription) =>
                    pipe(
                        RepoSubscription.updateLastSync(subscription._id),
                        taskEither.chain(() => ApiTwitter.pull(subscription)),
                        taskEither.chain(ApiOrbis.push),
                    ),
                ),
                taskEither.sequenceSeqArray,
            )
        }),
        // tweets[0] = an array of tweets for a subscription
        // this isn't optimal so ill refactor later
        taskEither.map((tweets) => ({
            pulled: tweets.length,
            pushed: tweets.length,
        })),
    )
}
