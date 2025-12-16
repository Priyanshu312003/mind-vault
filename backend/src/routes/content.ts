import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.post("/", (req: Request, res: Response) => { });

router.get("/", (req: Request, res: Response) => { });

router.get("/:id", (req: Request, res: Response) => { });

router.delete("/:id", (req: Request, res: Response) => { });

export default router;