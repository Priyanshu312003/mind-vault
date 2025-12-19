import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { login, me, signup } from "../controllers/auth";

const router = Router();

// Public routes
router.post("/signup", signup);

router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, me);

export default router;