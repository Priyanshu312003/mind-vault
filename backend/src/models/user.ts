import { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    plan: "FREE" | "PRO" | "TEAM";
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plan: {
        type: String,
        enum: ["FREE", "PRO", "TEAM"],
        default: "FREE",
    },
    createdAt: { type: Date, default: Date.now },
});

export const UserModel = model<IUser>("User", UserSchema);