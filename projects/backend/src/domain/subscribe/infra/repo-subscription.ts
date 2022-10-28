import { TaskEither } from "fp-ts/lib/TaskEither"
import { model, Model, Schema } from "mongoose"

import { type Subscription } from "@tob/common/src/domain/subscription"
import { type SubscriptionId } from "@tob/common/src/domain/subscription-id"
import { TwitterUserId } from "@tob/common/src/domain/twitter-user-id"

import { createOne } from "./repo-subscription-create-one"

interface DocumentModel extends Model<Subscription> {
    createOne(id: TwitterUserId): TaskEither<Error, SubscriptionId>
}

const schema = new Schema<Subscription, DocumentModel>(
    {
        userId: String,
        lastSync: { type: Date, default: () => new Date() },
    },
    {
        timestamps: true,
        statics: {
            createOne,
        },
    },
)

export const RepoSubscription = model<Subscription, DocumentModel>(
    "subscription",
    schema,
)
