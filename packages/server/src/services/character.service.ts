import { Character } from "../entities/character.entity";
import { GqlContext } from "../constants";
import { indexDocument, AvailableIndexes } from "../utils/indexer";
import { Service } from "typedi";
import { 
    CharactersFetchInput, 
    CreateCharacterInput, 
    DeleteCharacterInput 
} from "../inputs/character.inputs";
import { ObjectId } from "@mikro-orm/mongodb";

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

    async deleteCharacter(
        { em, options }: GqlContext & { options: DeleteCharacterInput }
    ): Promise<boolean> {
        return Boolean(
            em.nativeDelete(Character, {
                _id: new ObjectId(options._id)
            })
        );
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