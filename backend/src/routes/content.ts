import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createContent, getAllContent, getSingleContent, deleteContent } from "../controllers/content";

const contentRouter = Router();

contentRouter.post("/", authMiddleware, createContent);

contentRouter.get("/", authMiddleware, getAllContent);

contentRouter.get("/:id", authMiddleware, getSingleContent);

contentRouter.delete("/:id", authMiddleware, deleteContent);

export default contentRouter;