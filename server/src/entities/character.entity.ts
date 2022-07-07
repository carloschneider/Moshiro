import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { DateTimeResolver, ObjectIDResolver, URLResolver } from "graphql-scalars";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Character {
    @Field(() => ObjectIDResolver, {
        nullable: false,
        description: "Unique identificator of the document"
    })
    @PrimaryKey()
    _id!: ObjectId;

    @Property({
        nullable: true
    })
    index?: String;

    @Field(() => [ObjectIDResolver], {
        nullable: true,
        description: "Array of object id's of the anime that is character bound to",
        defaultValue: [],
    })
    @Property({
        nullable: false,
        default: [],
    })
    boundTo: string[] = [];


    @Field(() => String, {
        nullable: false,
        description: "Name of the characters"
    })
    @Property({
        nullable: false
    })
    name!: string;

    @Field(() => DateTimeResolver, {
        nullable: true,
        description: "Character's birthday"
    })
    @Property({
        nullable: true
    })
    birthday?: Date;

    @Field(() => String, {
        nullable: true,
        description: "Short descriptive text describing the character and the environment close to him"
    })
    @Property({
        nullable: true
    })
    description?: string;

    @Field(() => Number, {
        nullable: true,
        description: "Character's age in numeric type"
    })
    @Property({
        nullable: true
    })
    age(): number | null {
        if(!this.birthday) return null;

        const diff: number = Date.now() - this.birthday?.getTime();
        return new Date(diff).getUTCFullYear() - 1970;
    }

    @Field(() => URLResolver, {
        nullable: true,
        description: 'URL link to picture of the character'
    })
    @Property({
        nullable: true
    })
    imageUrl?: string;
}