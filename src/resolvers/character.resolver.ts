import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { GqlContext } from "../constants";
import { Character } from "../entities/character.entity";
import { CreateCharacterInput, CharactersFetchInput } from "../inputs/character.inputs";
import { createCharacterService, fetchCharacterService } from "../services/character.service";

@Resolver()
export class CharacterResolver {
    @Mutation(() => Character) 
    async createCharacter(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: CreateCharacterInput
    ): Promise<Character | null> {
        return createCharacterService({ req, res, em, redis, options, elastic });
    }

    @Query(() => Character)
    async fetchCharacter(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: CharactersFetchInput
    ): Promise<Character | null> {
        return fetchCharacterService({ req, res, em, redis, elastic, options });
    }
}