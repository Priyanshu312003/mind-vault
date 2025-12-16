import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.post("/signup", (req: Request, res: Response) => { });

router.post("/login", (req: Request, res: Response) => { });

router.get("/me", (req: Request, res: Response) => { });

export default router;