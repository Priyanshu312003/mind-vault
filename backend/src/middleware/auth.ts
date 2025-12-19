import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = parts[1];

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret not configured" });
        }

        const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload;

        const userId = decoded.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        (req as any).userId = user._id.toString();
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}