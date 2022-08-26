import { Field, InputType, ObjectType } from "type-graphql";
import { Anime } from "../entities/anime.entity";

@ObjectType()
export class ErrorType {
    @Field({
        nullable: false
    })
    message!: string;

    @Field({
        nullable: true
    })
    field?: string;
}

@InputType()
export class FetchAnimeInput {
    @Field(() => String, {
        nullable: true
    })
    _id?: string;
}

@ObjectType()
export class FetchAnimeResponse {
    @Field(() => Anime, {
        nullable: true
    })
    anime?: Anime;

    @Field(() => [ErrorType], {
        nullable: true
    })
    errors?: ErrorType[]
}

@ObjectType()
export class DeleteAnimeResponse {
    @Field({
        nullable: false,
        description: "If the deletion succeeded or not"
    })
    success!: boolean;

    @Field(() => [ErrorType], {
        nullable: true
    })
    errors?: ErrorType[]
}

@InputType()
export class CreateAnimeInput {
    @Field({
        nullable: true,
        description: "URL pointing to location of banner"
    })
    bannerUrl?: string;

    @Field({
        description: "URL pointing to location of cover",
        nullable: true
    })
    coverUrl?: string;

    @Field({
        description: "Anime title",
        nullable: false
    })
    title!: string;

    @Field({
        description: "Format of the show, could be for example TV",
        nullable: false
    })
    format!: string;

    @Field({
        nullable: false,
        description: "Number of episodes"
    })
    episodes!: number;

    @Field({
        nullable: true, 
        description: "Duration of one episode (in minutes)"
    })
    epDuration?: number;

    @Field({
        defaultValue: new Date(),
        nullable: true,
        description: "Release date of the anime"
    })
    releasedOn?: number;

    @Field({
        nullable: false,
        description: "Brief description of the anime"
    })
    description!: string;

    @Field({
        nullable: true,
        defaultValue: 0,
        description: `Everytime user does an interaction with this anime, 
        for example adding the show to user's list, popularity will be incremented by one`
    })
    popularity: number = 0;

    @Field(
        () => [String],
        {
            nullable: true,
            defaultValue: [],
            description: "Array of tags, for example (Romance, Action, Mystery)"
        }
    )
    tags?: string[]

    @Field(
        () => [String],
        {
            defaultValue: [],
            description: "Array of studio ids"
        }
    )
    studios!: string[]

    @Field(
        () => [String],
        {
            description: "Array of user ids"
        }
    )
    favourites!: string[]
}