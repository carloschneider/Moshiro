import { ObjectId } from "@mikro-orm/mongodb";
import { Max, Min } from "class-validator";
import { ObjectIDResolver } from "graphql-scalars";
import { Field, InputType } from "type-graphql";
import { RelationshipType } from "../entities/relationship.entity";

@InputType()
export class createRelationInput {
    @Field(() => ObjectIDResolver, {
        nullable: false,
        description: "Recipient of the relation"
    })
    _id!: ObjectId;

    @Field(() => RelationshipType, {
        nullable: false,
        description: "Type of the relation to create"
    })
    type!: RelationshipType;
}

@InputType()
export class fetchRelationInput {
    @Field(() => Number, {
        nullable: true,
        defaultValue: 1,
        description: "What page to fetch"
    })
    @Min(1)
    page!: number;

    @Field(() => Number, {
        nullable: true,
        defaultValue: 1,
        description: "How many results to fetch"
    })
    @Min(1)
    @Max(25)
    perPage!: number;

    @Field(() => RelationshipType, {
        nullable: false,
        defaultValue: RelationshipType.FRIENDS_SENT_REQUEST,
        description: "Type of relation to fetch"
    })
    type!: RelationshipType;
}

@InputType()
export class deleteRelationInput {
    @Field(() => ObjectIDResolver, {
        nullable: false,
        description: "Id of the relation"
    })
    _id!: ObjectId;
}