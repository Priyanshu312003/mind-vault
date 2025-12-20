import { UserModel } from "../models/user";
import { NextFunction, Request, Response } from "express";

export async function requireProPlan(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (user.plan !== "PRO") {
            return res.status(403).json({ message: "Upgrade to PRO to access this feature" });
        }

        next();
    }
    catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}