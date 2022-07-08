import { FetchAnimeInput, CreateAnimeInput, DeleteAnimeResponse, FetchAnimeResponse } from "../inputs/anime.inputs";
import { AnimeService } from "../services/anime.service";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Anime } from "../entities/anime.entity";
import { GqlContext } from "../constants";
import { Service } from "typedi";

@Service()
@Resolver(() => Anime)
export class AnimeResolver {
    constructor(
        private readonly service: AnimeService,
    ){};

    @Query(() => FetchAnimeResponse)
    async anime(
        @Ctx() { em, res, req, redis, elastic }: GqlContext,
        @Arg('options') options: FetchAnimeInput
    ): Promise<FetchAnimeResponse> {
        return this.service.get({ em, options, req, res, redis, elastic });
    }

    @Authorized(["USER"])
    @Mutation(() => Anime)
    async createAnime(
        @Ctx() { em, req, res, redis, elastic }: GqlContext,
        @Arg('options') options: CreateAnimeInput,
    ): Promise<Anime> {
        return this.service.createAnime({ em, options, req, res, redis, elastic })
    } 

    @Authorized(["USER"])
    @Mutation(() => DeleteAnimeResponse)
    async deleteAnime(
        @Ctx() { em, res, req, redis, elastic }: GqlContext,
        @Arg("id", () => String) id: string
    ): Promise<DeleteAnimeResponse> {
        return this.service.deleteAnime({ em, id, req, res, redis, elastic });
    }
}