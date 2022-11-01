import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Log } from "@tob/backend/src/domain/bridge/log"
import {
    ProfileSubscription,
    TwitterProfile,
} from "@tob/backend/src/domain/common"
import { TwitterWrapper } from "@tob/backend/src/utils/twitter-wrapper"

export function profileFetch(
    subscription: ProfileSubscription,
): TaskEither<Error, TwitterProfile> {
    return pipe(
        tryCatch(
            async () => {
                const { userId, username } = subscription
                Log.info("Fetching profile for %s %s", userId, username)

                const client = TwitterWrapper.createClient()
                const response = await client.users.findUserById(userId, {
                    "user.fields": [
                        "username",
                        "profile_image_url",
                        "created_at",
                    ],
                })

                if (response.errors) throw response.errors

                const { data } = response
                const raw = {
                    id: userId,
                    created: data?.created_at,
                    username: data?.username,
                    profileImage: data?.profile_image_url,
                }

                return TwitterProfile.parse(raw)
            },
            (cause) => new Error("profileFetch", { cause }),
        ),
    )
}
