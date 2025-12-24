import mongoose from "mongoose";
import { Request, Response } from "express";
import { ContentModel } from "../models/content";

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
        const content = await ContentModel.find({ userId }).sort({ createdAt: -1 });

        return res.json(content);
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