import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.post("/checkout", (req: Request, res: Response) => { });

router.post("/webhook", (req: Request, res: Response) => { });

export default router;