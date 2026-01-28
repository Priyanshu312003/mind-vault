import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createTag, deleteTag, getTags } from "../controllers/tag.controller";

const tagRouter = Router();

tagRouter.post("/", authMiddleware, createTag);

tagRouter.get("/", authMiddleware, getTags);

tagRouter.delete("/:id", authMiddleware, deleteTag);

export default tagRouter;