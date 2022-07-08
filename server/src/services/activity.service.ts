import { Service } from "typedi";
import { Activity } from "../entities/activity.entity";
import { FetchActivityInput, FetchActivityResponse } from "../inputs/activity.inputs";
import { GqlContext } from "../constants";
import { ObjectId } from "@mikro-orm/mongodb";

@Service()
export class ActivityService {
    async getActivity(
        { em, options }: GqlContext & { options: FetchActivityInput }
    ): Promise<FetchActivityResponse> {
        const found = await em.findOne(Activity, {
            _id: new ObjectId(options._id.toString())
        });

        if(!found) {
            return {
                errors: [
                    {
                        message: "Activity cannot be found!"
                    }
                ]
            }
        };

        return {
            activity: found
        };
    }
}