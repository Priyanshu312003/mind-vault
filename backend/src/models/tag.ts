import mongoose, { model, Schema } from "mongoose";

export interface ITag {
    title: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const TagSchema = new Schema<ITag>({
    title: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
},
    {
        timestamps: true,
    }
);

// prevent duplicate tags per user
TagSchema.index({ title: 1, userId: 1 }, { unique: true });

export const TagModel = model<ITag>("Tag", TagSchema);