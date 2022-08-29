import { Authorized, FieldResolver, Root, Mutation, Query, Resolver, Ctx, Arg } from "type-graphql";
import { PostCreateInput, PostDeleteInput, PostFetchInput, PostModifyInput } from "../inputs/post.input";
import { Post } from "../entities/post.entity";
import { GqlContext } from "../constants";
import { Service } from "typedi";
import { PostService } from "../services/post.service";
import { User } from "../entities/user.entity";
import { ObjectId } from "@mikro-orm/mongodb";

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

    @FieldResolver()
    async author(
        @Root() item: Post,
        @Ctx() { em }: GqlContext
    ) {
        return await em.findOne(User, {
            _id: new ObjectId(item.author)
        });
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
    async modify(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: PostModifyInput
    ) {
        return this.service.modify({ req, res, em, redis, elastic, options });
    }

    @Query(() => [Post])
    async fetchPost(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: PostFetchInput
    ) {
        return this.service.fetch({ req, res, em, redis, elastic, options });
    }
}