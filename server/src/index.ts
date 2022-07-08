'use strict';
import 'reflect-metadata';
import { CharacterResolver } from './resolvers/character.resolver';
import { ActivityResolver } from './resolvers/activity.resolver';
import { AnimeResolver } from './resolvers/anime.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { ApolloServer } from 'apollo-server-express';
import { userJwt, __prod__ } from './constants';
import authChecker from './utils/authChecker';
import { MikroORM } from '@mikro-orm/core';
import { buildSchema } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { req } from './constants';
import { config } from 'dotenv';
import * as redisMod from 'redis';
import express from 'express';
import { AvailableIndexes } from './utils/indexer';
import searchRouter from './routes/search';
import { Client } from '@elastic/elasticsearch';
import { Container } from 'typedi';
import {
    typeDefs as scalarTypeDefs,
    resolvers as scalarResolvers
} from 'graphql-scalars';

function getCookie(name: string, cookies: string | undefined): string | undefined {
    if(!cookies) return undefined;

    const value = `; ${cookies}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
    } else {
        return undefined;
    }
}

export let elastic: Client;
const main = async () => {
    config();

    const orm = await MikroORM.init({
        entities: ['./dist/entities/**/*.entity.js'], 
        entitiesTs: ['./src/entities/**/*.entity.ts'],
        port: parseInt(process.env.DB_PORT || '27017'),
        dbName: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        user: process.env.DB_USERNAME,
        allowGlobalContext: true,
        type: 'mongo',
        debug: !__prod__
    });

    try {
        elastic = new Client({
            node: `http://localhost:${process.env.ELASTIC_PORT || 9200}`,
        });

        console.log("Elastic client succefully instantiated!");

        if(!await elastic.indices.exists({
            index: AvailableIndexes.USER
        })) {
            elastic.indices.create({
                index: AvailableIndexes.USER
            });
        };

        if(!await elastic.indices.exists({
            index: AvailableIndexes.CHARACTER
        })) {
            elastic.indices.create({
                index: AvailableIndexes.CHARACTER
            });
        };

        if(!await elastic.indices.exists({
            index: AvailableIndexes.ANIME
        })) {
            elastic.indices.create({
                index: AvailableIndexes.ANIME
            });
        };

        console.log("All elastic indexes are succesfully created!")
    } catch(e) {
        return;
    }

    const app = express();

    app.use((req, _res, next) => {
        if(!process.env.JWT_SECRET) return next();

        const cookie = getCookie("token", req.headers.cookie);

        (<req>req).userId = cookie 
        ? (<userJwt>verify(String(cookie).split(" ")[1], process.env.JWT_SECRET))._id 
        : undefined;

        return next();
    })

    const redis = redisMod.createClient();

    redis.on('error', err => {
        return process.stderr.write(err);
    });

    redis.on('connect', async _ => {
        return process.stdout.write("Redis client connected!\n");
    })

    await redis.connect();

    const apolloServer = new ApolloServer({
        typeDefs: [
            scalarTypeDefs
        ],
        resolvers: [
            scalarResolvers
        ],
        schema: await buildSchema({
            resolvers: [
                AnimeResolver,
                UserResolver,
                CharacterResolver,
                ActivityResolver
            ],
            container: Container,
            authChecker: authChecker,
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res, redis, elastic })
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ 
        app, 
        cors: {
            origin: process.env.ORIGIN || true,
            credentials: true
        }
    });

    app.use('/search', searchRouter);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        process.stdout.write(`GraphQl server listening on port ${port}\n`)
    });
};

main();