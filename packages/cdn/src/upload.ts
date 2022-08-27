import { FastifyReply, FastifyRequest } from "fastify";

export const uploadHandler = function(_req: FastifyRequest, res: FastifyReply) {
    res.send("Uploading...");
}

export const uploadSchema = {
    querystring: {
      key: { type: 'string' }
    },

    response: {
      // Asset was succefully uploaded
      200: {
        type: 'object',
        properties: {
          url: { type: 'string' }
        }
      },

      // Incorrect key was provided
      401: {
          type: 'object',
          properties: {
              message: { type: 'string' }
          }
      },

      // You are being ratelimited
      429: {
          type: 'object', 
          properties: {
              for: { type: 'integer' }
          }
      }
    }
};