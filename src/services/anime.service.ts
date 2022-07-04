import { GqlContext } from "../constants";
import { CreateAnimeInput, FetchAnimeInput } from "../inputs/anime.inputs";
import { Anime } from "../entities/anime.entity";
import { ObjectId } from "@mikro-orm/mongodb";
import { ListInput } from "../inputs/user.inputs";
import { Character } from "../entities/character.entity";
import { AnimeCharacterListInput } from "../inputs/character.inputs";
import { CharacterSort } from "../inputs/character.inputs";
import { indexDocument, AvailableIndexes, deleteDocument } from "../utils/indexer";

export async function getAnimeService(
    { em, options, redis }: GqlContext & { options: FetchAnimeInput }
): Promise<Anime | null> {
    const data = {
        ...options._id && { 
            _id: new ObjectId(options._id.toString()) 
        }
    };

    const cached = await redis.get(`anime:${data._id?.toString()}`);
    if(cached) return JSON.parse(cached);

    const found: any = await em.findOne(Anime, data);

    if(!found) return null;

    await redis.setEx(`anime:${found._id?.toString()}`, 1000, JSON.stringify(found));

    return found;
}

export async function getUsersAnimeList(
    { em, options, oIdArr }: GqlContext & { options: ListInput, oIdArr: ObjectId[] }
): Promise<Anime[]> {
    // Count how many documents to skip
    let toSkip: number = 10;
    if(options && options.page && options.perPage) {
        if(options.page == 1) {
            toSkip = 0;
        } else {
            // Limit user to max 25 records per page
            toSkip = options.page * (options.perPage > 25 ? 25 : options.perPage);
        }
    }

    const [data, _count] = await em.findAndCount(Anime, {
        _id: {
            $in: oIdArr
        },
    }, {
        offset: toSkip,
        limit: options ? (!options.perPage ? 10 : options.perPage) : 10
    })

    return data;
}

export async function deleteAnimeService(
    { em, id, elastic }: GqlContext & { id: string }
): Promise<boolean> {
    const found: any = await em.findOne(Anime, {
        _id: new ObjectId(id)
    });

    await deleteDocument(
        AvailableIndexes.ANIME, 
        elastic,
        found?.index
    );
    
    const animeDel = await em.nativeDelete(Anime, {
        _id: new ObjectId(id)
    })
    
    return Boolean(animeDel);
}

export async function createAnimeService(
    { em, options, elastic }: GqlContext & { options: CreateAnimeInput }
): Promise<Anime> {
    const newAnime = em.create(Anime, options);

    const indexId = await indexDocument(
        AvailableIndexes.ANIME,
        newAnime, 
        elastic
    );
    newAnime.index = indexId;
    
    await em.persistAndFlush(newAnime);

    return newAnime;
}

export async function fetchAnimeCharacters(
    { em, aId, options }: GqlContext & { options: AnimeCharacterListInput, aId: ObjectId }
): Promise<[Character]> {
    let toSkip: number = 0;
    if(options && options.page && options.perPage) {
        if(options.page == 1) {
            toSkip = 0;
        } else {
            // Limit user to max 25 records per page
            toSkip = options.page * (options.perPage > 25 ? 25 : options.perPage);
        }
    }

    let sortOrder;
    if(options.sort) {
        switch(options.sort) {
            case CharacterSort.AGE_ASC:
                sortOrder = {
                    birthday: 1
                }
                break;

            case CharacterSort.AGE_DESC: 
                sortOrder = {
                    birthday: -1
                }
                break;

            case CharacterSort.NAME_ASC: 
                sortOrder = {
                    name: 1
                }
                break;

            case CharacterSort.NAME_DESC:
                sortOrder = {
                    name: -1
                }
                break;
        }
    }

    const found: any = await em.find(Character, {
        boundTo: {
            $in: [aId.toString()]
        }
    }, {
        orderBy: sortOrder,
        offset: toSkip,
        limit: options ? (!options.perPage ? 10 : options.perPage) : 10
    });

    return found;
}