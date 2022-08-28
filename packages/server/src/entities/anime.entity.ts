import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Arg, Ctx, emitSchemaDefinitionFile, Field, Int, ObjectType } from "type-graphql";
import { DateTimeResolver, ObjectIDResolver, URLResolver } from "graphql-scalars";
import { ObjectId } from "@mikro-orm/mongodb";
import { Character } from "./character.entity";
import { GqlContext } from "../constants";
import { ListInput } from "../inputs/user.inputs";
import { fetchAnimeCharacters } from "../services/anime.service";
import { AnimeCharacterListInput } from "../inputs/character.inputs";

@ObjectType()
@Entity()
export class Anime {
    @Field(() => ObjectIDResolver, {
        description: "Unique identificator of the anime"
    })
    @PrimaryKey({
        unique: true
    })
    _id!: ObjectId;

    @Field(() => String, {
        description: "unique identificator of the image"
    })
    @Property({
        nullable: true
    })
    cover?: string;

    @Field(() => String, {
        description: "unique identificator of the image"
    })
    @Property({
        nullable: true
    })
    banner?: string;

    @Property({
        nullable: true
    })
    index?: String;

    @Field(() => String, {
        description: "Format of the show"
    })
    @Property()
    format!: string;

    @Field(() => Number, {
        description: "Duration of one episode in minutes"
    })
    @Property({
        nullable: true
    })
    epDuration?: number;

    @Field(() => Number, {
        description: "Time of the anime release"
    })
    @Property({
        nullable: true
    })
    releasedOn?: number;

    @Field(() => Number, {
        description: "Number of interactions with this anime",
        defaultValue: 0
    })
    @Property({
        nullable: true
    })
    popularity: number = 0;

    @Field(() => DateTimeResolver, {
        description: "Time of the last document update"
    })
    @Property({
        onUpdate: () => new Date(),
        onCreate: () => new Date()
    })
    updatedAt?: Date;

    @Field(() => DateTimeResolver, {
        description: "Time of the document creation"
    })
    @Property({
        onCreate: () => new Date()
    })
    createdAt?: Date;

    @Field(() => String, {
        description: "Short title"
    })
    @Property()
    title!: string;

    @Field(() => String, {
        description: "Short description"
    })
    @Property()
    description!: string;

    @Field(() => [String], {
        description: "Tags of the anime"
    })
    @Property()
    tags?: [string];

    @Field(() => [ObjectIDResolver], {
        description: "Studios that took part of creating the anime"
    })
    @Property()
    studios!: [string];

    @Field(() => Int, {
        description: "Short description"
    })
    @Property()
    episodes!: number;

    @Field(() => [Character] || null, {
        description: "Array of all characters that are presnent in the show",
        nullable: true
    })
    async characterList (
        @Ctx() { em, req, res, redis, elastic }: GqlContext,
        @Arg('options', { nullable: true }) options: AnimeCharacterListInput
    ): Promise<[Character]> {
        return fetchAnimeCharacters({ em, aId: this._id, options, req, res, redis, elastic });
    }
}