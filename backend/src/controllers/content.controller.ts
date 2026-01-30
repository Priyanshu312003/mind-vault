import mongoose from "mongoose";
import { Request, Response } from "express";
import { ContentModel } from "../models/content";
import { ShareModel } from "../models/share";

/**
* CREATE CONTENT
* POST /content
*/
export const createContent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { title, description, link, tags } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        if (!Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ message: "At least one tag is required" });
        }

        const content = await ContentModel.create({
            title,
            link,
            description,
            tags,
            userId,
            // embedding intentionally omitted
        });

        return res.status(201).json(content);
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

/**
 * GET ALL CONTENT (USER ONLY)
 * GET /content
 */
export const getAllContent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const shareToken = req.query.shareToken as string | undefined;

        // OWNER MODE
        if (userId) {
            const content = await ContentModel
                .find({ userId })
                .sort({ createdAt: -1 });

            return res.json(content);
        }

        // SHARED MODE
        if (!shareToken) {
            return res.status(400).json({ message: "Access denied: No share token provided" });
        }

        const share = await ShareModel.findOne({ shareToken });

        if (!share) {
            return res.status(403).json({ message: "Access denied: Invalid share token" });
        }

        // ITEM SHARE
        if (share.targetType === "ITEM") {
            const item = await ContentModel.findById(share.targetId);
            if (!item) {
                return res.status(404).json({ message: "Shared content not found" });
            }
            return res.json([item]);
        }

        // BRAIN SHARE
        if (share.targetType === "BRAIN") {
            const content = await ContentModel
                .find({ userId: share.ownerId })
                .sort({ createdAt: -1 });
            return res.json(content);
        }

        return res.status(400).json({ message: "Invalid share type" });
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message || "Failed to fetch content" });
    }

};

/**
 * GET A SINGLE CONTENT
 * GET /content/:id
 */
export const getSingleContent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const id = req.params.id;
        const shareToken = req.query.shareToken as string | undefined;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid content id" });
        }

        const content = await ContentModel.findById(id);

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        const isOwner = content.userId.toString() === userId;

        if (!isOwner) {
            if (!shareToken) {
                return res.status(403).json({ message: "Access denied" });
            }


            const share = await ShareModel.findOne({
                shareToken,
                $or: [
                    { targetType: "ITEM", targetId: content._id, },
                    { targetType: "BRAIN", ownerId: content.userId, }
                ]
            });

            if (!share) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        return res.json(content);
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message || "Failed to fetch content" });
    }

};

/**
 * DELETE CONTENT
 * DELETE /content/:id
 */
export const deleteContent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const id = req.params.id;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid content id" });
        }

        const content = await ContentModel.findById(id);

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        if (content.userId.toString() !== userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        await content.deleteOne();

        return res.json({ message: "Content deleted successfully" });
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message || "Failed to delete content" });
    }
};

/**
 * UPDATE CONTENT
 * PUT /content/:id
 */
export const updateContent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const id = req.params.id;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid content id" });
        }

        const content = await ContentModel.findById(id);

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        if (content.userId.toString() !== userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (req.body.title !== undefined) {
            content.title = req.body.title;
        }

        if (req.body.link !== undefined) {
            content.link = req.body.link;
        }

        if (req.body.description !== undefined) {
            content.description = req.body.description;
        }

        if (req.body.tags !== undefined) {
            content.tags = req.body.tags;
        }

        // Final state Validation
        if (!content.link && !content.description) {
            return res.status(400).json({ message: "Either Link or Description is required" });
        }

        if (!Array.isArray(content.tags) || content.tags.length === 0) {
            return res.status(400).json({ message: "At least one tag is required" });
        }

        await content.save();

        return res.status(200).json(content);
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message || "Failed to update content" })
    }
}