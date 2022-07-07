import { CharactersFetchInput, CreateCharacterInput } from "../inputs/character.inputs";
import { Character } from "../entities/character.entity";
import { GqlContext } from "../constants";
import { indexDocument, AvailableIndexes } from "../utils/indexer";

export async function createCharacterService(
    { em, options, elastic }: GqlContext & { options: CreateCharacterInput }
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

export async function fetchCharacterService(
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