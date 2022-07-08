import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { InputActivityType } from "../inputs/user.inputs";
import { Anime } from "./anime.entity";
import { User } from "./user.entity";

export enum ActivityType {
    TEXT = 'text',
    ANIME = 'anime'
}

registerEnumType(ActivityType, {
    name: "ActivityType",
    description: "What type of activity user did",
});

@ObjectType()
@Entity()
export class Activity {
    @PrimaryKey()
    @Field(() => String, {
        description: "Unique identificator of the activity"
    })
    _id!: ObjectId;

    @Property({
        nullable: false
    })
    @Field(() => String, {
        nullable: false
    })
    boundTo!: ObjectId;

    @Field(() => String, {
        nullable: false
    })
    @Property({
        nullable: false
    })
    type!: ActivityType;

    @Property({
        nullable: true
    })
    @Field(() => String, {
        nullable: true,
        description: "Only present when activity type is text"
    })
    textContent?: string;

    @Property({
        type: ObjectId,
        nullable: true
    })
    @Field(() => Anime, {
        nullable: true
    })
    anime?: Anime;

    @Property({
        nullable: true
    })
    @Field(() => InputActivityType, {
        nullable: true
    })
    animeActivityType?: InputActivityType;
}