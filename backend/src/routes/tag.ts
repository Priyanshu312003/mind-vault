import { Router } from "express";
import { Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { createTag, deleteTag, getTags } from "../controllers/tag";

const router = Router();

router.post("/", authMiddleware, createTag);

router.get("/", authMiddleware, getTags);

router.delete("/:id", authMiddleware, deleteTag);

export default router;