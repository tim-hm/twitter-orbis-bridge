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
    subscriptions: number
    tweets: number
}

// This is a naive implementation because:
// 1 - running in sequence with adoption that would be too slow.
// 2 - Running in parallel without batches would consume too many resources.
export function sync(): TaskEither<Error, SyncResult> {
    return pipe(
        RepoProfileSubscription.findActive(),
        taskEither.chain((subscriptions: ProfileSubscription[]) =>
            pipe(
                subscriptions,
                array.map((subscription) =>
                    pipe(
                        // This should be after successful sync
                        RepoProfileSubscription.updateLastSync(
                            subscription._id,
                        ),
                        taskEither.chain(() =>
                            ApiTwitter.profileTweetsFetch(subscription),
                        ),
                        taskEither.chain((tweets) =>
                            ApiOrbis.push(subscription.privateKey, tweets),
                        ),
                    ),
                ),
                taskEither.sequenceSeqArray,
                taskEither.map((tweets) => ({
                    subscriptions: subscriptions.length,
                    tweets: tweets.reduce((acc, howMany) => acc + howMany, 0),
                })),
            ),
        ),
    )
}
