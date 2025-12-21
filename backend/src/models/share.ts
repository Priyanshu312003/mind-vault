import mongoose, { model, Schema } from "mongoose";

export interface IShare {
    shareId: string;
    type: "BRAIN" | "ITEM";
    userId: mongoose.Types.ObjectId;
    itemId?: mongoose.Types.ObjectId;
    access: "READ" | "WRITE";
    createdAt: Date;
    updatedAt: Date;
};

const ShareSchema = new Schema<IShare>({
    shareId: { type: String, unique: true, required: true, index: true },
    type: {
        type: String,
        enum: ["BRAIN", "ITEM"],
        required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    itemId: {
        type: Schema.Types.ObjectId,
        ref: "Content",
        required: function () {
            return this.type === "ITEM";
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

export const ShareModel = model<IShare>("Share", ShareSchema);