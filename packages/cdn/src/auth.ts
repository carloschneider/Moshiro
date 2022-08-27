import crypto from 'node:crypto';
import argon2 from 'argon2';
import { 
    FastifyReply, 
    FastifyRequest 
} from "fastify";

/**
 * @async
 * @export
 * @description The hashed key enables communication between main server and
 * all cdn nodes and not end users. After the hash is checked, encrypted key will be 
 * generated. This key can be then used only once to upload images to specified endpoint.
 * @param {FastifyRequest} req 
 * @param {FastifyReply} res 
 * @returns {Promise<FastifyReply>}
 */
export const authHandler = async function(
    req: FastifyRequest & { body: any }, 
    res: FastifyReply
): Promise<FastifyReply> {
    if(!process.env.ENCRKEY || !process.env.COMSECRET) {
        return res.status(500).send({
            reason: "Please specify all encryption keys!"
        });
    }; 

    const hashValid: boolean = await argon2.verify(
        req.body.hash, 
        process.env.COMSECRET || ""
    );
    if(!hashValid) {
        return res.status(401).send({
            reason: "Hash does not match!"
        });
    };

    const rand: string = crypto
        .randomBytes(16)
        .toString("hex")
        .slice(0, 16);

    const message: string = crypto
        .randomBytes(128)
        .toString("base64");

    const encrypter = crypto.createCipheriv(
        'aes-256-cbc', 
        /*
            This is clearly to avoid type error, exception that will lead to ""
            being used will never happen, because is is being checked at the start
            of the route
        */
        process.env.ENCRKEY || "", 
        rand
    );
    let encrypted = encrypter.update(message, 'utf-8', 'ascii');
    
    return res.status(200).send({
        value: encrypted
    });
};

export const authSchema = {
    response: {
        200: {
            type: 'object', 
            properties: {
                value: { type: 'string' }
            }
        },

        500: {
            type: 'object',
            properties: {
                reason: { type: 'string' }
            }
        },

        401: {
            type: 'object',
            properties: {
                reason: { type: 'string' },
            }
        }
    }
};