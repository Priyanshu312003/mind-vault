import mongoose, { model, Schema, Document } from "mongoose";

export interface ITag extends Document {
    title: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const TagSchema = new Schema({
    title: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
},
    {
        timestamps: true,
    }
);

export const TagModel = model<ITag>("Tag", TagSchema);