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

config();

const fastify = Fastify({
    logger: true 
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

redis.createClient()
    .connect()
    .then(() => {
        console.log("Redis client succefully connected!");
    })
    .catch(err => {
        console.log("Error happened while estabilishing connection with redis: ", err);
    });

fastify.listen({
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000 
}, function(err, addr) {
    if(err) {
        throw new Error(err.message);
    };

    console.log(`CDN server listening on ${addr.toString()}`);
});