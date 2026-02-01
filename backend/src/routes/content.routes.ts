import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createContent, getAllContent, getSingleContent, deleteContent, updateContent } from "../controllers/content.controller";
import { optionalAuthMiddleware } from "../middleware/optionalAuth";

const contentRouter = Router();

contentRouter.post("/", authMiddleware, createContent);

// optional auth → owner or shared access
contentRouter.get("/", optionalAuthMiddleware, getAllContent);
contentRouter.get("/:id", optionalAuthMiddleware, getSingleContent);

contentRouter.delete("/:id", authMiddleware, deleteContent);

contentRouter.put("/:id", authMiddleware, updateContent);

export default contentRouter;