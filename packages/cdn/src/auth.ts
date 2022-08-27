import { FastifyReply, FastifyRequest } from "fastify";

export const authHandler = function(req: FastifyRequest, res: FastifyReply) {
    res.send("Authenticating...");
};

export const authSchema = {
    querystring: {
        hash: { type: 'string' }
    },

    response: {
        200: {
            type: 'boolean'
        },

        401: {
            type: 'object',
            properties: {
                reason: { type: 'string' },
            }
        }
    }
};