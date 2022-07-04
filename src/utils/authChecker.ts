import { User } from "../entities/user.entity";
import { __prod__ } from "../constants";

export default async function({ context }: any, roles: any) {
    let canPass = true;

    if(!context.req.userId) return false;

    const user = await context.em.findOne(User, {
        _id: context.req.userId
    });

    if(!user) return false;

    context.req.user = user;

    if(!__prod__) {
        for(const role of roles) {
            if(role == "ADMIN" && user.isAdmin != true) {
                canPass = false;
            } else if(role == "USER" && !user) {
                canPass = false;
            }
        }    
    }

    return canPass;
};