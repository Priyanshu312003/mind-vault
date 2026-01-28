import { Router } from "express";
import { Request, Response } from "express";

const searchRouter = Router();

// owner search with AI
searchRouter.get("/", (req: Request, res: Response) => { });

// shared (no AI)
searchRouter.get("/public", (req: Request, res: Response) => { });

export default searchRouter;