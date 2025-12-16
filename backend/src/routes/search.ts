import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

// owner search with AI
router.get("/", (req: Request, res: Response) => { });

// shared (no AI)
router.get("/public", (req: Request, res: Response) => { });

export default router;