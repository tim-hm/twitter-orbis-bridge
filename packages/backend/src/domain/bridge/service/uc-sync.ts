import { array, taskEither } from "fp-ts"
import { TaskEither } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { ApiOrbis } from "@tob/backend/src/domain/bridge/infra/api-orbis"
import { ApiTwitter } from "@tob/backend/src/domain/bridge/infra/api-twitter"
import { RepoProfileSubscription } from "@tob/backend/src/domain/bridge/infra/repo-profile-subscription"
import { ProfileSubscription } from "@tob/common/src/domain/profile-subscription"

export type SyncResult = {
    pulled: number
    pushed: number
}

// This is a naive implementation because:
// 1 - running in sequence with adoption that would be too slow.
// 2 - Running in parallel without batches would consume too many resources.
export function sync(): TaskEither<Error, SyncResult> {
    return pipe(
        RepoProfileSubscription.findActive(),
        taskEither.chain((subscriptions: ProfileSubscription[]) => {
            return pipe(
                subscriptions,
                array.map((subscription) =>
                    pipe(
                        // RepoSubscription.updateLastSync(subscription._id),
                        // taskEither.chain(() => ApiTwitter.pull(subscription)),
                        ApiTwitter.pullProfile(subscription),
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
