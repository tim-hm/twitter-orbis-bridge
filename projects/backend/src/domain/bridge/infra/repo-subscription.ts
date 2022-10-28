import { TaskEither } from "fp-ts/lib/TaskEither"
import { model, Model, Schema } from "mongoose"

import { type Subscription } from "@tob/common/src/domain/subscription"
import { type SubscriptionId } from "@tob/common/src/domain/subscription-id"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"

import { createOne } from "./repo-subscription-create-one"
import { findActive } from "./repo-subscription-find-active"
import { updateLastSync } from "./repo-subscription-update-last-sync"

interface DocumentModel extends Model<Subscription> {
    createOne(id: TwitterUserId): TaskEither<Error, SubscriptionId>
    findActive(): TaskEither<Error, Subscription[]>
    updateLastSync(id: SubscriptionId): TaskEither<Error, void>
}

const schema = new Schema<Subscription, DocumentModel>(
    {
        userId: { type: String, index: true },
        lastSync: { type: Date, default: () => new Date() },
        active: { type: Boolean, default: true },
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

export const RepoSubscription = model<Subscription, DocumentModel>(
    "subscription",
    schema,
)
