import Fastify from 'fastify';
import { config } from 'dotenv';

// Routes
import {
    uploadHandler,
    uploadSchema
} from './upload';

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

fastify.listen({
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000 
}, function(err, addr) {
    if(err) {
        throw new Error(err.message);
    };

    console.log(`CDN server listening on ${addr.toString()}`);
});