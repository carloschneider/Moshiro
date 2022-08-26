import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { GqlContext } from "../constants";
import { Feed, FeedResponse, FetchFeedInput } from "../inputs/feed.input";
import { FeedService } from "../services/feed.service";

@Service()
@Resolver(() => Feed)
export class FeedResolver {
    constructor(
        private readonly service: FeedService
    ){};

    @Query(() => Feed) 
    async fetchFeed(
        @Ctx() { em, redis, req, res, elastic }: GqlContext,
        @Arg('options') options: FetchFeedInput
    ): Promise<FeedResponse> {
        return this.service.fetchFeed({ em, redis, req, res, elastic, options });
    }
}