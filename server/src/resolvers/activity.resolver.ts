import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Activity } from "../entities/activity.entity";
import { Service } from "typedi";
import { FetchActivitiesInput, FetchActivitiesResponse, FetchActivityInput, FetchActivityResponse } from "../inputs/activity.inputs";
import { GqlContext } from "../constants";
import { ActivityService } from "../services/activity.service";

@Service()
@Resolver(() => Activity) 
export class ActivityResolver {
    constructor(
        private readonly service: ActivityService,
    ){};

    @Query(() => FetchActivityResponse)
    async fetchActivity(
        @Ctx() { em, res, req, redis, elastic }: GqlContext,
        @Arg('options') options: FetchActivityInput,
    ): Promise<FetchActivityResponse> {
        return this.service.getActivity({ em, options, res, redis, req, elastic });
    }

    @Query(() => FetchActivitiesResponse) 
    async fetchActivities(
        @Ctx() { em, res, req, redis, elastic }: GqlContext,
        @Arg('options') options: FetchActivitiesInput,
    ): Promise<FetchActivitiesResponse> {
        return this.service.getActivities({ em, options, res, redis, req, elastic })
    }
}