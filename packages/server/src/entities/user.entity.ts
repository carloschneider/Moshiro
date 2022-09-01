import { 
    Entity, 
    PrimaryKey, 
    Property, 
    Unique 
} from "@mikro-orm/core";
import { 
    EmailAddressResolver,
    ObjectIDResolver
} from 'graphql-scalars';
import { Arg, Ctx, Field, ObjectType } from "type-graphql";
import { ListInput } from "../inputs/user.inputs";
import { ObjectId } from "@mikro-orm/mongodb";
import { GqlContext } from "../constants";
import { Anime } from "./anime.entity";
import { Relationship } from "./relationship.entity";
import { Post } from "./post.entity";

@ObjectType()
@Entity()
@Unique({ properties: ['email', '_id'] })
export class User {
    @Field(() => ObjectIDResolver, {
        description: "Unique identificator of the user"
    })
    @PrimaryKey()
    _id!: ObjectId;

    @Property({
        nullable: true
    })
    index?: String;

    @Field(() => String, {
        nullable: true,
        description: "Unique identificator of the image leading to user's avatar"
    })
    @Property({
        nullable: true
    })
    avatar?: String;

    @Field(() => Boolean, {
        description: "Identifies if user is administrator or not",
        defaultValue: false
    })
    @Property({
        default: false
    })
    isAdmin?: boolean;

    @Field(() => String)
    @Property()
    username!: string;

    @Property()
    password!: string;

    @Field(() => EmailAddressResolver)
    @Property()
    email!: string;

    @Property({
        default: []
    })
    watching: ObjectId[] = []

    @Property({
        default: []
    })
    planning: ObjectId[] = []

    @Property({
        default: []
    })
    dropped: ObjectId[] = []

    @Property({
        default: []
    })
    completed: ObjectId[] = []

    @Field(() => [Anime], {
        nullable: true,
        description: "List of anime user is watching"
    })
    anime?: Anime[];

    @Field(() => [Relationship], {
        nullable: true,
        description: "List of user's relationships"
    })
    relationships?: Relationship[];

    @Field(() => [Post], {
        nullable: true,
        description: "List of user's posts"
    })
    posts?: Post[];
}