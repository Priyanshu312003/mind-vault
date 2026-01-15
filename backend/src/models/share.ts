import mongoose, { model, Schema } from "mongoose";

export interface IShare {
    shareToken: string;
    targetType: "BRAIN" | "ITEM";
    ownerId: mongoose.Types.ObjectId;
    targetId?: mongoose.Types.ObjectId;
    access: "READ" | "WRITE";
    createdAt: Date;
    updatedAt: Date;
};

const ShareSchema = new Schema<IShare>({
    shareToken: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    targetType: {
        type: String,
        enum: ["BRAIN", "ITEM"],
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    targetId: {
        type: Schema.Types.ObjectId,
        ref: "Content",
        required: function () {
            return this.targetType === "ITEM";
        }
    },
    access: {
        type: String,
        enum: ["READ", "WRITE"],
        default: "READ",
        required: true,
    },
},
    {
        timestamps: true,
    },
);

ShareSchema.index(
    { ownerId: 1, targetId: 1, targetType: 1 },
    { unique: true }
)

export const ShareModel = model<IShare>("Share", ShareSchema);