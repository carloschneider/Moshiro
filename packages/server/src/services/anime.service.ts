import { CreateAnimeInput, DeleteAnimeResponse, FetchAnimeInput, FetchAnimeResponse } from "../inputs/anime.inputs";
import { GqlContext } from "../constants";
import { Anime } from "../entities/anime.entity";
import { ObjectId } from "@mikro-orm/mongodb";
import { ListInput } from "../inputs/user.inputs";
import { Character } from "../entities/character.entity";
import { AnimeCharacterListInput } from "../inputs/character.inputs";
import { CharacterSort } from "../inputs/character.inputs";
import { indexDocument, AvailableIndexes, deleteDocument } from "../utils/indexer";
import { Service } from "typedi";
import sharp from 'sharp';
import fs from 'node:fs';
import * as uuid from 'uuid';

@Service()
export class AnimeService {
    async get(
        { em, options, redis }: GqlContext & { options: FetchAnimeInput }
    ): Promise<FetchAnimeResponse> {
        const data = {
            ...options._id && { 
                _id: new ObjectId(options._id.toString()) 
            }
        };
    
        const cached = await redis.get(`anime:${data._id?.toString()}`);
        if(cached) return {
            anime: JSON.parse(cached)
        };
    
        const found: any = await em.findOne(Anime, data);
    
        if(!found) return {
            errors: [
                {
                    message: "No anime found by this _id!"
                }
            ]
        };
    
        await redis.setEx(
            `anime:${found._id?.toString()}`, 
            1000, 
            JSON.stringify(found)
            // TODO: Probably little unsafe, replace when possible
                .replace("id", "_id")
        );
    
        return {
            anime: found
        };
    }

    async deleteAnime(
        { em, id, elastic }: GqlContext & { id: string }
    ): Promise<DeleteAnimeResponse> {
        const found: any = await em.findOne(Anime, {
            _id: new ObjectId(id)
        });
    
        if(!found) {
            return {
                success: false,
                errors: [
                    {
                        message: "Anime can't be found!"
                    }
                ]
            }
        };
    
        await deleteDocument(
            AvailableIndexes.ANIME, 
            elastic,
            found?.index
        );
        
        const animeDel = await em.nativeDelete(Anime, {
            _id: new ObjectId(id)
        })
        
        return {
            success: Boolean(animeDel)
        };
    }

    async createAnime(
        { em, options, elastic }: GqlContext & { options: CreateAnimeInput }
    ): Promise<Anime> {
        let coverBase64: String | null = null;
        let bannerBase64: String | null = null;

        // Resize and compress images if defined
        if(options.cover) {
            await sharp(Buffer.from(options.cover, 'base64'))
                .resize(360, 537, {
                    fit: 'cover'
                })
                .png({
                    quality: 40,
                    compressionLevel: 7
                })
                .toBuffer()
                .then((buf: Buffer) => {
                    coverBase64 = buf.toString('base64');
                })
                .catch(_ => {
                    throw new Error("Failed to process cover image!");
                });
        }

        if(options.banner) {
            await sharp(Buffer.from(options.banner || "", 'base64'))
                .resize(1060, 371, {
                    fit: 'cover'
                })
                .png({
                    quality: 40,
                    compressionLevel: 7
                })
                .toBuffer()
                .then((buf: Buffer) => {
                    bannerBase64 = buf.toString('base64');
                })
                .catch(_ => {
                    throw new Error("Failed to process banner image");
                })
        }

        const newAnime = em.create(Anime, options);

        // Save Cover and Banner image if defined
        if(coverBase64) {
            newAnime.cover = uuid.v4();

            fs.writeFile(
                `static/anime_covers/${newAnime.cover}.png`, 
                Buffer.from(coverBase64, 'base64'),
                function(_) {
                    return;
                }
            );
        }
        
        if(bannerBase64) {
            newAnime.banner = uuid.v4();

            fs.writeFile(
                `static/anime_banners/${newAnime.banner}.png`, 
                Buffer.from(bannerBase64, 'base64'), 
                function(_) {
                    return;
                }
            );
        }

        const indexId = await indexDocument(
            AvailableIndexes.ANIME,
            newAnime, 
            elastic
        );
        newAnime.index = indexId;
        
        await em.persistAndFlush(newAnime);
    
        return newAnime;
    }
};