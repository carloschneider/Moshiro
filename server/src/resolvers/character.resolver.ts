import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { GqlContext } from "../constants";
import { Character } from "../entities/character.entity";
import { CreateCharacterInput, CharactersFetchInput } from "../inputs/character.inputs";
import { CharacterService } from "../services/character.service";
import { Service } from "typedi";

@Service()
@Resolver(() => Character)
export class CharacterResolver {
    constructor(
        private readonly characterService: CharacterService,
    ){};

    @Authorized(['USER'])
    @Mutation(() => Character) 
    async createCharacter(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: CreateCharacterInput
    ): Promise<Character | null> {
        return this.characterService.createCharacter({ req, res, em, redis, options, elastic })
    }

    @Query(() => Character)
    async fetchCharacter(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: CharactersFetchInput
    ): Promise<Character | null> {
        return this.characterService.fetchCharacter({ req, res, em, redis, options, elastic })
    }
}