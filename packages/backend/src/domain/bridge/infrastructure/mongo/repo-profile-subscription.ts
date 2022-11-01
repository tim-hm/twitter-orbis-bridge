import { TaskEither } from "fp-ts/lib/TaskEither"
import { model, Model, Schema } from "mongoose"

import { CollectionName } from "@tob/backend/src/constant"
import { ProfileMirrorCreateRequest } from "@tob/backend/src/domain/bridge/service/uc-profile-mirror"
import {
    type ProfileSubscription,
    type ProfileSubscriptionId,
} from "@tob/backend/src/domain/common"

import { createOne } from "./repo-subscription-create-one"
import { findActive } from "./repo-subscription-find-active"
import { updateLastSync } from "./repo-subscription-update-last-sync"

interface DocumentModel extends Model<ProfileSubscription> {
    createOne(
        params: ProfileMirrorCreateRequest,
    ): TaskEither<Error, ProfileSubscription>
    findActive(): TaskEither<Error, ProfileSubscription[]>
    updateLastSync(id: ProfileSubscriptionId): TaskEither<Error, void>
}

const schema = new Schema<ProfileSubscription, DocumentModel>(
    {
        active: { type: Boolean, default: true },
        lastSync: { type: Date, default: () => new Date() },
        userId: { type: String, index: true },
        username: String,
        privateKey: String,
    },
    {
        timestamps: true,
        statics: {
            createOne,
            findActive,
            updateLastSync,
        },
    },
)

export const RepoProfileSubscription = model<
    ProfileSubscription,
    DocumentModel
>(CollectionName.SubscriptionProfile, schema)
