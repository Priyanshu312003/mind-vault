import { Router } from "express";
import { Request, Response } from "express";

const profileRouter = Router();

profileRouter.get("/", (req: Request, res: Response) => { });

export default profileRouter;