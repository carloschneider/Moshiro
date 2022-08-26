import { CharactersFetchInput, CreateCharacterInput } from "../inputs/character.inputs";
import { Character } from "../entities/character.entity";
import { GqlContext } from "../constants";
import { indexDocument, AvailableIndexes } from "../utils/indexer";
import { Service } from "typedi";

@Service()
export class CharacterService {
    async createCharacter(
        { em, options, elastic }: GqlContext & { options: CreateCharacterInput | any }
    ): Promise<Character> {
        const newCharacter = em.create(Character, options);

        const indexId = await indexDocument(
            AvailableIndexes.CHARACTER,
            newCharacter,
            elastic
        );
        newCharacter.index = indexId;
    
        await em.persistAndFlush(newCharacter);
    
        return newCharacter;
    }

    async fetchCharacter(
        { redis, em, options }: GqlContext & { options: CharactersFetchInput }
    ): Promise<Character | null> {
        const findQuery: any = {
            ...options._id && {
                _id: options._id
            }
        };
    
        const cached = await redis.get(`characters:${options._id}`);
        if(cached) {
            return JSON.parse(cached);
        };
    
        const dbFound = await em.findOne(Character, findQuery);
        
        await redis.setEx(`characters:${options._id}`, 12000, JSON.stringify(dbFound));
        return dbFound;
    }
}