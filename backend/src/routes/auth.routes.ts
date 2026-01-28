import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { login, me, signup } from "../controllers/auth.controller";

const authRouter = Router();

// Public routes
authRouter.post("/signup", signup);

authRouter.post("/login", login);

// Protected routes
authRouter.get("/me", authMiddleware, me);

export default authRouter;