import { FastifyReply, FastifyRequest } from "fastify";

/**
 * @description This will only be used by main server to sort the servers 
 * by their ip (location: lat, lon) and latency, to provide the best latency for
 * the end user
 * @param {FastifyRequest} _req 
 * @param {FastifyReply} res 
 * @returns {}
 */
export const pingHandler = async function(
    _req: FastifyRequest,
    res: FastifyReply
): Promise<FastifyReply> {
    return res
        .status(200)
        .send("Received!");
};