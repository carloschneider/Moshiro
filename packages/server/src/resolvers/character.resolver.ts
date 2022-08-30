import { 
    Arg, 
    Authorized, 
    Ctx, 
    Mutation, 
    Query, 
    Resolver, 
    ResolverInterface
} from "type-graphql";
import { GqlContext } from "../constants";
import { Character } from "../entities/character.entity";
import { CharacterService } from "../services/character.service";
import { Ratelimiter } from "../middleware/ratelimit";
import { Service } from "typedi";
import { 
    CreateCharacterInput, 
    CharactersFetchInput, 
    DeleteCharacterInput 
} from "../inputs/character.inputs";

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

    @Authorized(['USER'])
    @Mutation(() => Boolean)
    async deleteCharacter(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: DeleteCharacterInput
    ) {
        return this.characterService.deleteCharacter({ req, res, em, redis, elastic, options });
    }

    @Query(() => Character)
    async fetchCharacter(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: CharactersFetchInput
    ): Promise<Character | null> {
        return this.characterService.fetchCharacter({ req, res, em, redis, options, elastic })
    }
}