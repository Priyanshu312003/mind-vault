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
}