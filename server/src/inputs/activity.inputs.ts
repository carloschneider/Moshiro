import { Field, InputType, ObjectType } from "type-graphql";
import { Activity } from "../entities/activity.entity";
import { ErrorType } from "./anime.inputs";

@InputType()
export class FetchActivityInput {
    @Field(() => String, {
        nullable: false,
        description: "Unique identificator of the activity",
    })
    _id!: String;
}

@ObjectType()
export class FetchActivityResponse {
    @Field({
        nullable: true,
    })
    activity?: Activity;

    @Field(() => [ErrorType], {
        nullable: true,
    })
    errors?: ErrorType[]
}