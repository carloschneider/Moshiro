import { FieldResolver, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { Relationship } from "../entities/relationship.entity";
import { User } from "../entities/user.entity";

@Resolver()
@Service()
export class RelationshipResolver {
    @Mutation(() => Relationship)
    async createRelation() {

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