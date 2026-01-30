import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createContent, getAllContent, getSingleContent, deleteContent, updateContent } from "../controllers/content.controller";

const contentRouter = Router();

contentRouter.post("/", authMiddleware, createContent);

// Owner access handled inside controller
contentRouter.get("/", getAllContent);
contentRouter.get("/:id", getSingleContent);

contentRouter.delete("/:id", authMiddleware, deleteContent);

contentRouter.put("/:id", authMiddleware, updateContent);

export default contentRouter;