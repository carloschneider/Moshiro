import { IsImageFormat } from "../decorators/isImageFormat";
import { IsValidUnixTime } from "../decorators/isValidUnixTime";
import { Anime } from "../entities/anime.entity";
import { 
    Field, 
    InputType, 
    ObjectType 
} from "type-graphql";
import { 
    Max,
    MaxLength, Min, MinLength,
    IsBase64,
} from "class-validator";
import { IsObjectIdArr } from "../decorators/isObjectIdArr";

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
        description: "A base64 encoded string with cover image data"
    })
    @IsBase64()
    @IsImageFormat(['jpg', 'png'], {
        message: "Image should be in .jpg or .png format!"
    })
    cover?: string;

    @Field({
        description: "A base64 encoded string with banner image data",
        nullable: true
    })
    @IsBase64()
    @IsImageFormat(['jpg', 'png'], {
        message: "Image should be in .jpg or .png format!"
    })
    banner?: string;

    @Field({
        description: "Anime title",
        nullable: false
    })
    @MaxLength(128)
    @MinLength(1)
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
    @Min(1)
    @Max(10000)
    episodes!: number;

    @Field({
        nullable: true, 
        description: "Duration of one episode (in minutes)"
    })
    @Min(1)
    @Max(1000)
    epDuration?: number;

    @Field({
        defaultValue: new Date(),
        nullable: true,
        description: "Release date of the anime"
    })
    @IsValidUnixTime({
        message: "Please enter valid time!"
    })
    releasedOn?: number;

    @Field({
        nullable: false,
        description: "Brief description of the anime"
    })
    @MinLength(64)
    @MaxLength(4096)
    description!: string;

    @Field({
        nullable: true,
        defaultValue: 0,
        deprecationReason: `This was previously made to rank results in search, 
        but it's now automatically done by elasticsearch`,
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
    @MaxLength(10, {
        each: true
    })
    tags?: string[]

    @Field(
        () => [String],
        {
            defaultValue: [],
            description: "Array of studio ids"
        }
    )
    @MaxLength(10, {
        each: true
    })
    @IsObjectIdArr({
        message: "One of the studios is not valid!"
    })
    studios!: string[]
}