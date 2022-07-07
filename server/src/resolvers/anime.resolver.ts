import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Anime } from "../entities/anime.entity";
import { ObjectId } from '@mikro-orm/mongodb';
import { GqlContext } from "../constants";
import { FetchAnimeInput, CreateAnimeInput } from "../inputs/anime.inputs";
import { getAnimeService, deleteAnimeService, createAnimeService } from "../services/anime.service";

@Resolver()
export class AnimeResolver {
    @Query(() => Anime)
    async anime(
        @Ctx() { em, res, req, redis, elastic }: GqlContext,
        @Arg('options') options: FetchAnimeInput
    ): Promise<Anime | null> {
        return getAnimeService({ em, options, req, res, redis, elastic });
    }

    @Authorized(["USER"])
    @Mutation(() => Anime)
    async createAnime(
        @Ctx() { em, req, res, redis, elastic }: GqlContext,
        @Arg('options') options: CreateAnimeInput,
    ): Promise<Anime> {
        return createAnimeService({ em, options, req, res, redis, elastic });
    } 

    @Authorized(["USER"])
    @Mutation(() => Boolean)
    async deleteAnime(
        @Ctx() { em, res, req, redis, elastic }: GqlContext,
        @Arg("id", () => String) id: string
    ): Promise<boolean> {
        return deleteAnimeService({ em, id, req, res, redis, elastic });
    }
}