import express, { Router } from "express";
import fs from 'node:fs';

const router = Router();

router.get('/*', async(req: express.Request, res: express.Response) => {
    fs.readFile(
        `static/${req.path.replace("/", "")}`,
        function(err: NodeJS.ErrnoException | null, data: Buffer) {
            if(err) {
                return res.status(404).send("Can't find this image!");
            } else {
                return res
                    .writeHead(200, {
                        'Content-Type': 'image/png',
                        'Content-Length': data.length,
                        "Cache-Control": "public, max-age=31557600",
                    })
                    .end(data);
            }
        }
    )
});

export default router;