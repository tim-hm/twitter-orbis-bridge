import { UpdateProfileContent } from "@orbisclub/orbis-sdk"
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"

import { Log } from "@tob/backend/src/domain/bridge/log"
import {
    ProfileSubscription,
    TwitterProfile,
} from "@tob/backend/src/domain/common"
import { OrbisWrapper } from "@tob/backend/src/utils/orbis-wrapper"

export function profileUpdate(params: {
    subscription: ProfileSubscription
    profile: TwitterProfile
}): TaskEither<Error, ProfileSubscription> {
    return tryCatch(
        async () => {
            const { subscription, profile } = params

            const orbis = OrbisWrapper.from(subscription.privateKey)
            const client = await orbis.connect()

            const content = toContent(profile)
            const res = await client.updateProfile(content)

            if (res.error) throw res.error

            Log.info("Create profile success: %o", res)

            await orbis.disconnect()

            return subscription
        },
        (cause) => new Error("push", { cause }),
    )
}

function toContent(profile: TwitterProfile): UpdateProfileContent {
    return {
        username: profile.username,
        description: `This profile is mirrored from twitter using the Twitter-Orbis-Bridge.

            Created: ${profile.created.toISOString()}
            Source: https://twitter.com/${profile.username}
        `,
        pfp: profile.profileImage,
    }
}
