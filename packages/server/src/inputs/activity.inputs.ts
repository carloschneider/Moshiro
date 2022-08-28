import { Field, InputType, ObjectType } from "type-graphql";
import { IsObjectId } from "../decorators/isObjectid";
import { Activity } from "../entities/activity.entity";
import { ErrorType } from "./anime.inputs";

@InputType()
export class FetchActivityInput {
    @Field(() => String, {
        nullable: false,
        description: "Unique identificator of the activity",
    })
    @IsObjectId({
        message: "Please specify valid id!"
    })
    _id!: String;
}

@InputType()
export class FetchActivitiesInput {
    @Field(() => String, {
        nullable: false,
        description: "Unique identificator of the user to fetch activities from"
    })
    @IsObjectId({
        message: "Please specify valid id!"
    })
    byUserId!: String;
}

@ObjectType()
export class FetchActivitiesResponse {
    @Field(() => [Activity], {
        nullable: false,
        description: "Array of user's activities"
    })
    activities!: Activity[];
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