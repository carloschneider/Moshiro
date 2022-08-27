import { Field, InputType,  registerEnumType } from "type-graphql";
import { DateResolver, ObjectIDResolver } from "graphql-scalars";
import { IsBase64, IsDate, IsUrl, Length, Max, MaxLength, Min } from "class-validator";
import { IsImageFormat } from "../decorators/isImageFormat";

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
    @MaxLength(10, {
        each: true
    })
    boundTo: string[] = [];

    @Field(() => String, {
        nullable: false,
        description: "Name of the character"
    })
    @Length(2, 64)
    name!: string;

    @Field(() => DateResolver, {
        nullable: true,
        description: "Birth day of the character"
    })
    @IsDate()
    birthday?: Date;

    @Field(() => String, {
        nullable: true,
        description: "Brief description of the character"
    })
    @Length(10, 4096)
    description?: string;

    @Field(() => String, {
        nullable: true,
        description: "A base64 encoded string with character's image data"
    })
    @IsBase64()
    @IsImageFormat(['jpg', 'png'])
    imageUrl?: string;
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
    @Min(1)
    @Max(1000)
    page?: number;

    @Field(() => Number, {
        nullable: true
    })
    @Min(1)
    @Max(25)
    perPage?: number;

    @Field(() => CharacterSort, {
        nullable: true,
        defaultValue: CharacterSort.AGE_DESC,
        description: "Sort the characters based on value",
    })
    sort?: CharacterSort;
}