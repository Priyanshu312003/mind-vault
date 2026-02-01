import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../models/user";
import { NextFunction, Request, Response } from "express";

// Used on public GET routes → attach userId if token exists, otherwise allow shareToken access, never block request
export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return next();
    }

    try {
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return next();
        }

        const token = parts[1];

        if (!process.env.JWT_SECRET) {
            return next();
        }

        const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload;

        const userId = decoded.userId;
        if (!userId) {
            return next();
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return next();
        }

        (req as any).userId = user._id.toString();
    }
    catch {
    }
    next();
};