import { Service } from "typedi";
import { Activity } from "../entities/activity.entity";
import { FetchActivitiesInput, FetchActivitiesResponse, FetchActivityInput, FetchActivityResponse } from "../inputs/activity.inputs";
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

    async getActivities(
        { em, options }: GqlContext & { options: FetchActivitiesInput }
    ): Promise<FetchActivitiesResponse> {
        const found = await em.find(Activity, {
            boundTo: new ObjectId(options.byUserId.toString())
        });

        return {
            activities: found
        };
    }
}