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
import { getUsersAnimeList } from "../services/anime.service";

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
        defaultValue: [],
        description: "List of anime that is user watching, completed, planning or dropped."
    })
    async list(
        @Ctx() { em, req, res, redis, elastic }: GqlContext,
        @Arg('options', () => ListInput, {
            nullable: true
        }) options: ListInput
    ): Promise<Anime[]> {
        return getUsersAnimeList({
            em,
            req,
            res,
            redis,
            options,
            elastic,
            // When user don't provide type, it will be "watching" by default
            oIdArr: this[options ? (options.type ? options.type : "watching") : "watching"]
        });
    }
}