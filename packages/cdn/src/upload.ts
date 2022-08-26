import { FastifyReply, FastifyRequest } from "fastify";

export const uploadHandler = function(req: FastifyRequest, res: FastifyReply) {
    res.send("fdhfkljd");
}

export const uploadSchema = {
    querystring: {
      key: { type: 'string' }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          url: { type: 'string' }
        }
      },
      401: {
          type: 'object',
          properties: {
              message: { type: 'string' }
          }
      },
      429: {
          type: 'object', 
          properties: {
              for: { type: 'integer' }
          }
      }
    }
};