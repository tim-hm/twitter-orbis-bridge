import { array, taskEither } from "fp-ts"
import { TaskEither } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import {
    ApiOrbis,
    ApiTwitter,
} from "@tob/backend/src/domain/bridge/infrastructure"
import { RepoProfileSubscription } from "@tob/backend/src/domain/bridge/infrastructure/mongo/repo-profile-subscription"
import { ProfileSubscription } from "@tob/backend/src/domain/common"

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
                        ApiTwitter.profileFetch(subscription),
                        taskEither.chain((tweets) => {
                            const key = subscription.privateKey
                                .split(",")
                                .map((e) => Number(e))
                            const uint = Uint8Array.of(...key)

                            return ApiOrbis.push(uint, tweets)
                        }),
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
