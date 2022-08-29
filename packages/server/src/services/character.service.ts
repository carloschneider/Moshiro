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
import * as uuid from 'uuid';
import sharp from 'sharp';
import fs from 'node:fs';

@Service()
export class CharacterService {
    async createCharacter(
        { em, options, elastic }: GqlContext & { options: CreateCharacterInput }
    ): Promise<Character> {
        let characterImageBase64: string | null = null;

        const newCharacter = em.create(Character, options);

        // Process character's image
        if(options.image) {
            await sharp(Buffer.from(options.image || "", 'base64'), {
                animated: false
            })
                .resize(360, 537, {
                    fit: 'cover'
                })
                .png({
                    quality: 30,
                    compressionLevel: 9
                })
                .toBuffer()
                .then((res: Buffer) => {
                    characterImageBase64 = res.toString('base64');
                })
                .catch(_ => {
                    throw new Error("Can't process character's image")
                })
        }

        // Save image and assign it's UUID to newCharacter object
        if(characterImageBase64) {
            newCharacter.image = uuid.v4();
            console.log(newCharacter.image);

            fs.writeFile(
                `static/character_image/${newCharacter.image}.png`, 
                Buffer.from(characterImageBase64, 'base64'), 
                function(_) {
                    return;
                }
            );
        }

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