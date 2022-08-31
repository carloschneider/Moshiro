import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { GqlContext } from "../constants";
import { Relationship } from "../entities/relationship.entity";
import { User } from "../entities/user.entity";
import { createRelationInput, deleteRelationInput, fetchRelationInput } from "../inputs/relationship.inputs";
import { RelationshipService } from "../services/relationship.service";

@Resolver()
@Service()
export class RelationshipResolver {
    constructor(
        private readonly service: RelationshipService,
    ){};

    @Mutation(() => Relationship)
    async createRelation(
        @Ctx() { req, res, redis, elastic, em }: GqlContext,
        @Arg('options') options: createRelationInput
    ): Promise<Relationship> {
        return this.service.createRelation({ req, res, redis, elastic, em, options });
    }

    @Mutation(() => Relationship)
    async removeRelation(
        @Ctx() { req, res, redis, elastic, em }: GqlContext,
        @Arg('options') options: deleteRelationInput
    ): Promise<Relationship> {
        return this.service.removeRelation({ req, res, redis, elastic, em, options });
    }

    @Query(() => [Relationship])
    async fetchRelations(
        @Ctx() { req, res, redis, elastic, em }: GqlContext,
        @Arg('options') options: fetchRelationInput
    ): Promise<Relationship[]> {
        return this.service.fetchRelations({ req, res, redis, elastic, em, options });
    }

    @FieldResolver(() => User)
    async sender(
        @Root() item: Relationship,
        @Ctx() { em }: GqlContext
    ): Promise<User | null> {
        return await em.findOne(User, {
            _id: item.sender
        });
    }

    @FieldResolver(() => User)
    async recipient(
        @Root() item: Relationship,
        @Ctx() { em }: GqlContext
    ): Promise<User | null> {
        return await em.findOne(User, {
            _id: item.recipient
        });
    }
}