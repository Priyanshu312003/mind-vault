import { Request, Response } from "express";
import { UserModel } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            plan: "FREE"
        });

        return res.status(201).json({ message: "User created" });
    }
    catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const passMatch = await bcrypt.compare(password, user.password);

        if (!passMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // if jwt secret is missing
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET missing");
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        return res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                plan: user.plan,
            },
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// page refresh, app reload, token is in local storage
export const me = async (req: Request, res: Response) => {
    try {
        //req.user will come from middleware
        const user = await UserModel.findById((req as any).user.userId).select("-password");

        // user deleted but token exists or logout from all devices functionality
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    }
    catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};
