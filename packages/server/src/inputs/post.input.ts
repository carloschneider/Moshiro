import { ObjectId } from "@mikro-orm/mongodb";
import { ObjectIDResolver } from "graphql-scalars";
import { Field, InputType } from "type-graphql";
import { Post } from "../entities/post.entity";

@InputType()
export class PostInput implements Partial<Post> {
    @Field(() => ObjectIDResolver, {
        nullable: false,
        description: "Author of the original post"
    })
    author!: ObjectId;

    @Field(() => String, {
        nullable: false,
        description: "Markdown content of the post"
    })
    content!: string;

    @Field(() => ObjectIDResolver, {
        nullable: true,
        description: "If the post is reply to another post (or comment, said in different way)"
    })
    isReplyTo?: ObjectId;

    @Field(() => Boolean, {
        nullable: true,
        description: "If set to true, the post is only visible to people author is friend with"
    })
    private?: boolean;
}