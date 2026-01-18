import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createShare,
  resolveShare,
  revokeShare,
} from "../controllers/share";

const router = Router();

// Create or regenerate a share link
router.post("/", authMiddleware, createShare);

// Resolve a share link (PUBLIC)
router.get("/:token", resolveShare);

// Revoke a share link
router.delete("/:id", authMiddleware, revokeShare);

export default router;
