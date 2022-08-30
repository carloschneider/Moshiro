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