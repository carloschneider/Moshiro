import { Authorized, Mutation, Query, Resolver, Ctx, Arg } from "type-graphql";
import { PostCreateInput, PostDeleteInput } from "../inputs/post.input";
import { Post } from "../entities/post.entity";
import { GqlContext } from "../constants";
import { Service } from "typedi";
import { PostService } from "../services/post.service";

@Service()
@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly service: PostService,
    ){};

    @Mutation(() => Post)
    @Authorized(['USER'])
    async createPost(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: PostCreateInput
    ) {
        return this.service.create({ req, res, em, redis, elastic, options });
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: PostDeleteInput
    ) {
        return this.service.delete({ req, res, em, redis, elastic, options });
    }

    @Mutation(() => Post)
    @Authorized(['USER'])
    async modify() {

    }

    @Query(() => Post)
    async fetchPost() {

    }
}