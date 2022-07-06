import express, { Router } from "express";
import authMiddleware from "./middleware/auth";

const router = Router();

router.post('/', authMiddleware, (_req: express.Request, res: express.Response) => {
    return res.status(400).json({lfkjdflkd: true});
});

export default router;