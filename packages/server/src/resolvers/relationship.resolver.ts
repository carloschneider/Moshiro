import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { GqlContext } from "../constants";
import { Relationship } from "../entities/relationship.entity";
import { User } from "../entities/user.entity";
import { createRelationInput } from "../inputs/relationship.inputs";
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
    ) {
        return this.service.createRelation({ req, res, redis, elastic, em, options });
    }

    @Mutation(() => Relationship)
    async removeRelation() {

    }

    @Query(() => [Relationship])
    async fetchRelations() {

    }

    @FieldResolver(() => User)
    async sender() {

    }

    @FieldResolver(() => User)
    async recipient() {

    }
}