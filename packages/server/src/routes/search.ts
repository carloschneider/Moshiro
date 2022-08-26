import express, { Router } from "express";
import { elastic } from "..";
import { AvailableIndexes } from "../utils/indexer";

const router = Router();

router.get('/', async(req: express.Request, res: express.Response) => {
    if(!req.query['query'] || req.query['query']?.length == 0) {
        return res.status(400).json({
            error: "Please provide query with search string!"
        });
    };

    let query  = {
        index: [
            AvailableIndexes.ANIME,
            AvailableIndexes.CHARACTER,
            AvailableIndexes.USER
        ],
        q: req.query['query']
    };

    // @ts-ignore
    const elRes = await elastic.search(query);

    return res.status(200).json(elRes.hits.hits);
});

export default router;