import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createShare,
  resolveShare,
  revokeShare,
  listShares,
} from "../controllers/share";

const router = Router();

// Create or regenerate a share link
router.post("/", authMiddleware, createShare);

// Resolve a share link (PUBLIC)
router.get("/:token", resolveShare);

// Revoke a share link
router.delete("/:id", authMiddleware, revokeShare);

// List all shares
router.get("/", authMiddleware, listShares);

export default router;
