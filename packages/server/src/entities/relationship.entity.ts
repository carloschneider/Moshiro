import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { ObjectIDResolver } from "graphql-scalars";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { IsObjectId } from "../decorators/isObjectid";
import { User } from "./user.entity";

export enum RelationshipType {
    FRIENDS = 1,
    FRIENDS_SENT_REQUEST = 2,
    BLOCKED = 4
}

registerEnumType(RelationshipType, {
    name: "RelationshipType",
    description: "Type of the relation to specific user"
});

@ObjectType()
@Entity()
export class Relationship {
    @PrimaryKey({
        nullable: false
    })
    @Field(() => ObjectIDResolver, {
        nullable: false,
        description: "Unique identificator of the relationship"
    })
    @IsObjectId()
    _id!: ObjectId;

    @Property({
        nullable: false
    })
    @Field(() => RelationshipType, {
        nullable: false,
        description: "Type of relationship"
    })
    type!: RelationshipType;

    @Property({
        nullable: false
    })
    @Field(() => User, {
        nullable: false,
        description: "Sender of this relationship"
    })
    sender!: ObjectId;

    @Property({
        nullable: false
    })
    @Field(() => User, {
        nullable: false,
        description: "Recipient of this relationship"
    })
    recipient!: ObjectId;
}