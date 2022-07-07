import express from "express";
import jwt from 'jsonwebtoken';

export default function(
    _req: Express.Request, 
    _res: Express.Response, 
    next: express.NextFunction
) {
    return next();
}