import { model, Schema } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    plan: "FREE" | "PRO" | "TEAM";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    plan: {
        type: String,
        enum: ["FREE", "PRO", "TEAM"],
        default: "FREE",
    },
},
    {
        timestamps: true,
    }
);

export const UserModel = model<IUser>("User", UserSchema);