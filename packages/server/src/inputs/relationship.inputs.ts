import { ObjectId } from "@mikro-orm/mongodb";
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
    page?: Number;

    @Field(() => Number, {
        nullable: true,
        defaultValue: 1,
        description: "How many results to fetch"
    })
    perPage?: Number;

    @Field(() => RelationshipType, {
        nullable: false,
        defaultValue: RelationshipType.FRIENDS__REQUEST,
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