import { DateResolver } from "graphql-scalars";
import { ObjectType, InputType, Field, registerEnumType } from "type-graphql";
import { Activity } from "../entities/activity.entity";
import { ErrorType } from "./anime.inputs";

export enum FeedType {
    GLOBAL = 'global',
    FOLLOWING = 'following'
};

registerEnumType(FeedType, {
    name: "FeedType",
    description: "Type of feed, could be global or only from following people"
});

@ObjectType()
export class Feed {
    @Field(() => [Activity], {
        nullable: false,
        description: "Array of activities"
    })
    activities!: Activity[];
};

@InputType()
export class FetchFeedInput {
    @Field(() => FeedType, {
        nullable: false,
        description: "Type of feed, could be 'following' or 'global'."
    })
    type!: FeedType;

    @Field(() => DateResolver, {
        nullable: true
    })
    from: Date = new Date();
};

@ObjectType() 
export class FeedResponse {
    @Field(() => Feed, {
        nullable: true
    })
    feed?: Feed;

    @Field(() => [ErrorType], {
        nullable: true
    })
    errors?: ErrorType[];
};