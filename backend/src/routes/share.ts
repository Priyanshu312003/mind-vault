import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.post("/brain", (req: Request, res: Response) => { });

router.get("/brain/:id", (req: Request, res: Response) => { });

router.post("/item/:id", (req: Request, res: Response) => { });

router.get("/item/:id", (req: Request, res: Response) => { });

export default router;