import { Request, Response } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { ContentModel } from "../models/content";
import { ShareModel } from "../models/share";

/**
 * POST /share
 * Create or regenerate a share link (BRAIN or ITEM)
 */
export const createShare = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { targetType, targetId, access } = req.body

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!["BRAIN", "ITEM"].includes(targetType)) {
            return res.status(400).json({ message: "Invalid targetType" });
        }

        let resolvedTargetId: mongoose.Types.ObjectId | undefined = undefined;

        //owenership check for item
        if (targetType === "ITEM") {
            if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
                return res.status(400).json({ message: "valid targetId required" });
            }


            const item = await ContentModel.findOne({
                _id: targetId,
                userId,
            });

            if (!item) {
                return res.status(403).json({ message: "You do not own this item" });
            }

            resolvedTargetId = item._id;
        }

        const shareToken = crypto.randomBytes(32).toString("hex");

        const share = await ShareModel.findOneAndUpdate(
            {
                ownerId: userId,
                targetType,
                targetId: resolvedTargetId,
            } as any,
            {
                ownerId: userId,
                targetType,
                targetId: resolvedTargetId,
                access: access === "WRITE" ? "WRITE" : "READ",
                shareToken,
            },
            {
                upsert: true,
                new: true,
            }
        ) as any;

        return res.status(201).json({
            shareToken: share.shareToken,
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Failed to create share" });
    }
};

/**
 * GET /share/:token
 * Resolve a share link
*/
export const resolveShare = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: "Share token is required" });
        }

        const share = await ShareModel.findOne({ shareToken: token });

        if (!share) {
            return res.status(404).json({ message: "Invalid or expired share link" });
        }

        //ITEM level share
        if (share.targetType === "ITEM") {
            if (!share.targetId) {
                return res.status(400).json({ message: "Invalid shared item" });
            }

            const content = await ContentModel.findOne({
                _id: share.targetId,
                userId: share.ownerId,
            });

            if (!content) {
                return res.status(404).json({ message: "Shared content not found" });
            }

            return res.status(200).json({
                type: "ITEM",
                access: share.access,
                data: content,
            });
        }

        // BRAIN level share
        if (share.targetType === "BRAIN") {
            const contents = await ContentModel.find({
                userId: share.ownerId,
            }).sort({ createdAt: -1 });

            return res.status(200).json({
                type: "BRAIN",
                access: share.access,
                data: contents,
            });
        }

        return res.status(400).json({ message: "Unknown share type" });
    }
    catch (err) {
        console.error("resolveShare error:", err);
        return res.status(500).json({ message: "Failed to resolve share" });
    }
};

/**
 * DELETE /share/:id
 * Revoke a share
 */
export const revokeShare = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid share id" });
        }

        const share = await ShareModel.findById(id);

        if (!share) {
            return res.status(404).json({ message: "Share not found" });
        }

        if (share.ownerId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await ShareModel.deleteOne({ _id: id });

        return res.status(200).json({ message: "Share revoked" });
    }
    catch (err) {
        return res.status(500).json({ message: "Failed to revoke share" });
    }
}

/**
 * GET /share
 * List all shares created by user
 */
export const listShares = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const shares = await ShareModel.find(
            {
                ownerId: userId,
            },
            {
                _id: 1,
                targetId: 1,
                targetType: 1,
                access: 1,
                shareToken: 1,
                createdAt: 1,
            }
        )
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            shares,
        });
    }
    catch (err) {
        console.error("listShares error:", err);
        return res.status(500).json({ message: "Failed to fetch shares" });
    }
};