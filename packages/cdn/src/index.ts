import { config } from 'dotenv';
import * as redis from 'redis';
import Fastify from 'fastify';

// Routes
import {
    uploadHandler,
    uploadSchema
} from './upload';
import { 
    authHandler, 
    authSchema 
} from './auth';

export let redisClient: redis.RedisClientType;

async function main() {
    config();

    const fastify = Fastify({
        logger: process.env.NODE_ENV == 'prod'
    });
    
    fastify.route({
        method: "POST",
        url: '/upload',
        schema: uploadSchema,
        handler: uploadHandler
    });
    
    fastify.route({
        method: "POST", 
        url: '/auth',
        schema: authSchema,
        handler: authHandler
    });
    
    redisClient = await redis.createClient();

    redisClient.connect()
        .then(() => {
            console.log("Redis client succefully connected!");
        })
        .catch((err: redis.ErrorReply) => {
            console.log(
                "An error occured while estabilishing connection with redis", 
                err.message
            );
        });
    
    fastify.listen({
        port: process.env.PORT ? parseInt(process.env.PORT) : 3000 
    }, function(err, addr) {
        if(err) {
            throw new Error(err.message);
        };
    
        console.log(`CDN server listening on ${addr.toString()}`);
    });
};

main();