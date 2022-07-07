import { Client } from "@elastic/elasticsearch";
import { Anime } from "../entities/anime.entity";
import { Character } from "../entities/character.entity";
import { User } from "../entities/user.entity";

export enum AvailableIndexes {
    ANIME = 'a',
    USER = 'u',
    CHARACTER = 'c'
};

export async function indexDocument(
    index: AvailableIndexes,
    document: User | Anime | Character,
    cl: Client
): Promise<String> {
    if(index === AvailableIndexes.USER) {
        document = Object.assign({}, document);
        // @ts-ignore
        delete document.password && delete document.email;
    }

    const iRes = await cl.index({
        index: index,
        // Don't make a reference because password will be soon saved to db
        document: document,
        refresh: true
    });

    return iRes._id;
}

export async function deleteDocument(
    index: AvailableIndexes, 
    cl: Client,
    indexId: string
): Promise<Boolean> {
    const res = await cl.delete({
        index: index,
        id: indexId
    });

    return res.result === 'deleted';
}

export async function updateDocument(
    index: AvailableIndexes,
    indexId: string,
    cl: Client,
    newParams: any
): Promise<Boolean> {
    const uRes = await cl.update({
        index: index,
        id: indexId,
        script: {
            params: newParams,
            id: indexId,
        }
    });

    return uRes.result === 'updated';
}