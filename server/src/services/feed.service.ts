import { FeedResponse, FeedType, FetchFeedInput } from "../inputs/feed.input";
import { Activity } from "../entities/activity.entity";
import { GqlContext } from "../constants";
import { Service } from "typedi";

@Service()
export class FeedService {
    async fetchFeed(
        { em, options }: GqlContext & { options: FetchFeedInput }
    ): Promise<FeedResponse> {
        if(options.type === FeedType.FOLLOWING) {
            return {
                errors: [
                    {
                        message: "Not implemented for now!",
                        field: "type"
                    }
                ]
            };
        } else {
            const found = await em.find(Activity, {
            }, {
                orderBy: {
                    createdAt: -1
                }
            });

            return {
                feed: {
                    activities: found
                }
            }
        }
    }
}