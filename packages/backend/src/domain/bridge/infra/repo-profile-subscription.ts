import { TaskEither } from "fp-ts/lib/TaskEither"
import { model, Model, Schema } from "mongoose"

import { createOne } from "./repo-subscription-create-one"
import { findActive } from "./repo-subscription-find-active"
import { updateLastSync } from "./repo-subscription-update-last-sync"

import { CreateMirrorProfileRequest } from "@tob/backend/src/domain/bridge/service/uc-mirror-profile"
import { CollectionName } from "@tob/common/src/constant/collections"
import { type ProfileSubscription } from "@tob/common/src/domain/profile-subscription"
import { type ProfileSubscriptionId } from "@tob/common/src/domain/profile-subscription-id"

interface DocumentModel extends Model<ProfileSubscription> {
    createOne(
        params: CreateMirrorProfileRequest,
    ): TaskEither<Error, ProfileSubscriptionId>
    findActive(): TaskEither<Error, ProfileSubscription[]>
    updateLastSync(id: ProfileSubscriptionId): TaskEither<Error, void>
}

const schema = new Schema<ProfileSubscription, DocumentModel>(
    {
        active: { type: Boolean, default: true },
        lastSync: { type: Date, default: () => new Date() },
        userId: { type: String, index: true },
        username: String,
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
