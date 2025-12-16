import mongoose, { model, Schema, Document } from "mongoose";

export interface IContent extends Document {
    title: string;
    link?: string;
    description?: string;
    tags: mongoose.Types.ObjectId[];
    // embedding optional because async process and can take time to load or not load at all due to ai disabled
    embedding?: number[];
    createdAt: Date;
    updatedAt: Date;
    userId: mongoose.Types.ObjectId;
};

const contentSchema = new Schema<IContent>({
    title: { type: String, required: true },
    link: { type: String },
    description: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    embedding: [{ type: Number }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
},
    {
        timestamps: true,
    }
);

export const ContentModel = model<IContent>("Content", contentSchema);