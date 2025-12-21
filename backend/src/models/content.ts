import mongoose, { model, Schema } from "mongoose";

export interface IContent {
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
    title: { type: String, required: true, trim: true },
    link: { type: String, trim: true },
    description: { type: String, trim: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    embedding: { type: [Number], default: undefined },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
},
    {
        timestamps: true,
    }
);

/**
 * Ensure content is not empty:
 * at least one of the link or description must exist
 */
contentSchema.pre("validate", function () {
    if (!this.link && !this.description) {
        throw new Error("Either Link or Description is required");
    }
});

export const ContentModel = model<IContent>("Content", contentSchema);