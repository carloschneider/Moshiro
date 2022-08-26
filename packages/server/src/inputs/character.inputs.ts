import { Field, InputType,  registerEnumType } from "type-graphql";
import { DateResolver, ObjectIDResolver } from "graphql-scalars";

@InputType() 
export class DeleteCharacterInput {
    @Field(() => ObjectIDResolver, {
        nullable: false,
        description: "Unique identificator of the anime you want to delete"
    }) 
    _id!: string;
}

@InputType()
export class CreateCharacterInput {
    @Field(() => [ObjectIDResolver], {
        description: "Anime shows that this character showed in"
    })
    boundTo: string[] = [];

    @Field(() => String, {
        nullable: false,
        description: "Name of the character"
    })
    name!: string;

    @Field(() => DateResolver, {
        nullable: true,
        description: "Birth day of the character"
    })
    birthday?: Date;

    @Field(() => String, {
        nullable: true,
        description: "Brief description of the character"
    })
    description?: string;

    @Field(() => String, {
        nullable: true,
        defaultValue: null,
        description: "Url path of the image following to 'avatar' of the character"
    })
    imageUrl?: string | null = null; 
};

export enum CharacterSort {
    AGE_ASC = "AGE_ASC",
    AGE_DESC = "AGE_DESC",
    NAME_ASC = "NAME_ASC",
    NAME_DESC = "NAME_DESC"
}

registerEnumType(CharacterSort, {
    name: "CharacterSort", 
    description: "Describes how to sort the characters"
});

@InputType()
export class CharactersFetchInput {
    @Field(() => String, {
        nullable: true
    })
    _id?: string;
}

@InputType()
export class AnimeCharacterListInput {
    @Field(() => Number, {
        nullable: true
    }) 
    page?: number;

    @Field(() => Number, {
        nullable: true
    })
    perPage?: number;

    @Field(() => CharacterSort, {
        nullable: true,
        defaultValue: CharacterSort.AGE_DESC,
        description: "Sort the characters based on value",
    })
    sort?: CharacterSort;
}