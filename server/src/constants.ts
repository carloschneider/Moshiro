import { Client } from "@elastic/elasticsearch";
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Jwt } from "jsonwebtoken";
import { RedisClientType } from "redis";
import { User } from "./entities/user.entity";

export const __prod__ =  process.env.NODE_ENV !== 'production';

export type GqlContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>,
    req: Request & { user: User },
    res: Response,
    redis: RedisClientType,
    elastic: Client
}

export interface req extends Request {
    userId?: string,
    user?: User
}

export interface userJwt extends Jwt {
    _id: string
}