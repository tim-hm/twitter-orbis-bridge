import * as crypto from "node:crypto"

import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither"

import { ProfileMirrorCreateRequest } from "@tob/backend/src/domain/bridge/service/uc-profile-mirror"
import { ProfileSubscription } from "@tob/backend/src/domain/common"

import { RepoProfileSubscription } from "./repo-profile-subscription"

export function createOne(
    params: ProfileMirrorCreateRequest,
): TaskEither<Error, ProfileSubscription> {
    return tryCatch(
        async () => {
            const privateKey = randomSeed()
            const result = await RepoProfileSubscription.create({
                userId: params.userId,
                username: params.username,
                privateKey,
            })
            return result.toObject() as ProfileSubscription
        },
        (cause: unknown) => new Error("createOne", { cause }),
    )
}

export function randomSeed(): Uint8Array {
    const buffer = new Uint8Array(32)
    return crypto.webcrypto.getRandomValues(buffer)
}
