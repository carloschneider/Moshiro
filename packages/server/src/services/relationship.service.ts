import { ObjectId } from "@mikro-orm/mongodb";
import { Service } from "typedi";
import { GqlContext } from "../constants";
import { Relationship, RelationshipType } from "../entities/relationship.entity";
import { User } from "../entities/user.entity";
import { createRelationInput } from "../inputs/relationship.inputs";

@Service()
export class RelationshipService {
    async createRelation(
        { em, req, options }: GqlContext & { options: createRelationInput }
    ): Promise<Relationship> {
        if(options._id.equals(req.user._id)) {
            throw new Error("You cannot friend yourself!");
        };

        const foundUser: User | null = await em.findOne(User, {
            _id: new ObjectId(options._id)
        });
        if(!foundUser) {
            throw new Error("This user does not exist!");
        };

        const foundRelations: Relationship[] = await em.find(Relationship, {
            $or: [
                {
                    recipient: req.user._id,
                    sender: options._id
                }, 
                {
                    recipient: options._id,
                    sender: req.user._id
                }
            ]
        });

        const blockedRelation: Relationship | undefined = foundRelations.find((item: Relationship) => {
            if((item.recipient == req.user._id || item.recipient == req.user._id) && item.type == RelationshipType.BLOCKED) {
                return true;
            } else return false;
        });
        if(blockedRelation) {
            throw new Error("Either you or the recipient have a blocked relation with you!");
        };

        const existingFriendRelation: Relationship | undefined = foundRelations.find((item: Relationship) => {
            if(item.type == RelationshipType.FRIENDS__REQUEST && item.recipient == req.user._id) return true;

            return false;
        });

        let newRelation: Relationship;
        if(existingFriendRelation) {
            /*
                User sending this request has already received friend request from the other side
                instead of creating new request, delete the existing one and create friends record
                for each side
            */
        } else {
            //  Create a new friend request because the recipient did not send request to sender
            await em.persistAndFlush(
                em.create(Relationship, {
                    sender: req.user._id,
                    recipient: options._id,
                    type: RelationshipType.FRIENDS__REQUEST
                })
            )
        }

        return newRelation;
    }
}