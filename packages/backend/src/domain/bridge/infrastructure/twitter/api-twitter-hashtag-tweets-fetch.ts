import { TaskEither } from "fp-ts/lib/TaskEither"

import { Tweet } from "@tob/backend/src/domain/common"

export function hashtagTweetsFetch(): TaskEither<Error, Tweet[]> {
    throw "Not implemented"
}
