import mongoose from "mongoose";
import { Request, Response } from "express";
import { TagModel } from "../models/tag";

/**
 * CREATE TAG
 * POST /tags
 */
export const createTag = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Tag title is required" });
        }

        const tag = await TagModel.create({
            title,
            userId,
        });

        return res.status(201).json({ message: "Created" });
    }
    catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Tag already exists" });
        }
        return res.status(500).json({ message: err.message || "Failed to create tag" });
    }
}

/**
 * BRING ALL TAGS
 * GET /tags
 */
export const getTags = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const tags = await TagModel.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json(tags);
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message || "Failed to fetch tags" });
    }
};

/**
 * DELETE TAG
 * DELETE /tags/:id
 */
export const deleteTag = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const id = req.params.id;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid tag id" });
        }

        const tag = await TagModel.findById(id);

        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        if (tag.userId.toString() !== userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        await tag.deleteOne();

        return res.status(200).json({ message: "Tag deleted successfully" });
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message || "Failed to delete tag" });
    }
};