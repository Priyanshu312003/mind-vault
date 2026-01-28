import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createShare,
  resolveShare,
  revokeShare,
  listShares,
} from "../controllers/share.controller";

const shareRouter = Router();

// Create or regenerate a share link
shareRouter.post("/", authMiddleware, createShare);

// Resolve a share link (PUBLIC)
shareRouter.get("/:token", resolveShare);

// Revoke a share link
shareRouter.delete("/:id", authMiddleware, revokeShare);

// List all shares
shareRouter.get("/", authMiddleware, listShares);

export default shareRouter;
