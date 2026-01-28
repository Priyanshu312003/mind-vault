import { Router } from "express";
import { Request, Response } from "express";

const billingRouter = Router();

billingRouter.post("/checkout", (req: Request, res: Response) => { });

billingRouter.post("/webhook", (req: Request, res: Response) => { });

export default billingRouter;