import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"

import { Config } from "@tob/backend/src/config"
import { Log } from "@tob/backend/src/domain/bridge/log"
import { ProfileSubscription } from "@tob/backend/src/domain/common/profile-subscription"
import { OrbisWrapper } from "@tob/backend/src/utils/orbis-wrapper"

export function profileUpdate(
    profile: ProfileSubscription,
): TaskEither<Error, ProfileSubscription> {
    return tryCatch(
        async () => {
            const orbis = OrbisWrapper.from(profile.privateKey)
            const client = await orbis.connect()

            const res = await client.updateProfile({
                username: profile.username,
            })

            if (res.error) throw res.error

            Log.info("Create profile success: %o", res)

            await orbis.disconnect()

            return profile
        },
        (cause) => new Error("push", { cause }),
    )
}
