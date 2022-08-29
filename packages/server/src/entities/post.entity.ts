import { 
    Entity, 
    PrimaryKey,
    Property, 
} from "@mikro-orm/core";
import { 
    ObjectIDResolver
} from 'graphql-scalars';
import { Field, ObjectType } from "type-graphql";
import { ObjectId } from "@mikro-orm/mongodb";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Post {
    @Field(() => ObjectIDResolver, {
        nullable: false,
        description: "Unique identificator of the post"
    })
    @PrimaryKey({
        nullable: false
    })
    _id!: ObjectId;

    @Field(() => User, {
        nullable: false,
        description: "Author of the original post"
    })
    @Property({
        nullable: false
    })
    author!: ObjectId;

    @Field(() => String, {
        nullable: false,
        description: "Markdown content of the post"
    })
    @Property({
        nullable: false
    })
    content!: string;

    @Field(() => Boolean, {
        nullable: true,
        description: "If set to true, the post is only visible to people author is friend with"
    })
    @Property({
        nullable: true
    })
    private?: boolean;

    @Field(() => Post, {
        nullable: true,
        description: "If this post is reply to another post (or comment, said in another way)"
    })
    @Property({
        nullable: true
    })
    isReplyTo?: ObjectId;
}