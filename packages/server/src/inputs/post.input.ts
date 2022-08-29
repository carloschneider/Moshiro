import { ObjectId } from "@mikro-orm/mongodb";
import { IsBoolean, Max, MaxLength, Min, MinLength } from "class-validator";
import { ObjectIDResolver } from "graphql-scalars";
import { Field, InputType, registerEnumType } from "type-graphql";
import { IsObjectId } from "../decorators/isObjectid";
import { Post } from "../entities/post.entity";

@InputType()
export class PostDeleteInput implements Partial<Post> {
    @Field(() => ObjectIDResolver, {
        nullable: false,
        description: "Unique identificator of the original post"
    })
    @IsObjectId({
        message: "Please provide a valid ObjectId"
    })
    _id!: ObjectId;
}

export enum FetchType {
    GLOBAL = 1,
    FOLLOWING = 2,
    FEED = 3
}

registerEnumType(FetchType, {
    name: "FetchType", 
    description: "Type of the post feed fetched"
});

@InputType()
export class PostFetchInput {
    @Field(() => FetchType, {
        nullable: true,
        defaultValue: FetchType.GLOBAL,
        description: "Type of the feed you want to fetch"
    })
    type!: FetchType;

    @Field(() => ObjectIDResolver, {
        nullable: true,
        description: "Author of the post from whom you want to fetch"
    })
    byUser?: ObjectId;

    @Field(() => Number, {
        nullable: true,
        defaultValue: 1,
        description: "Number of page to fetch"
    })
    @Min(1)
    page!: number;

    @Field(() => Number, {
        nullable: true,
        defaultValue: 10,
        description: "How many results to return"
    })
    @Min(1)
    @Max(25)
    perPage!: number;
}

@InputType()
export class PostModifyInput implements Partial<Post> {
    @Field(() => ObjectIDResolver, {
        nullable: false,
        description: "Unique identificator of the original post"
    })
    @IsObjectId({
        message: "Please provide a valid ObjectId"
    })
    _id!: ObjectId;
    
    @Field(() => String, {
        nullable: true,
        description: "Markdown content of the post"
    })
    @MinLength(1)
    @MaxLength(4096)
    content?: string;

    @Field(() => Boolean, {
        nullable: true,
        description: "If the post is private or not"
    })
    @IsBoolean()
    private?: boolean;
}

@InputType()
export class PostCreateInput implements Partial<Post> {
    @Field(() => ObjectIDResolver, {
        nullable: false,
        description: "Author of the original post"
    })
    @IsObjectId({
        message: "Please provide a valid ObjectId"
    })
    author!: ObjectId;

    @Field(() => String, {
        nullable: false,
        description: "Markdown content of the post"
    })
    @MaxLength(4096)
    @MinLength(1)
    content!: string;

    @Field(() => ObjectIDResolver, {
        nullable: true,
        description: "If the post is reply to another post (or comment, said in different way)"
    })
    @IsObjectId({
        message: "Please provide a valid ObjectId"
    })
    isReplyTo?: ObjectId;

    @Field(() => Boolean, {
        nullable: true,
        description: "If set to true, the post is only visible to people author is friend with"
    })
    @IsBoolean()
    private?: boolean;
}