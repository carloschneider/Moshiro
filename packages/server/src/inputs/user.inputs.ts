import { IsBase64, IsEmail, Length, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';
import { IsImageFormat } from '../decorators/isImageFormat';
import { IsObjectId } from '../decorators/isObjectid';
import { User } from '../entities/user.entity';

@InputType()
export class RegisterInput implements Partial<User> {
    @Field(() => String, {
        nullable: true
    })
    @IsBase64({
        message: "This image format is not supported!"
    })
    @IsImageFormat(['jpg', 'png', 'gif'], {
        message: "This image format is not supported"
    })
    avatar?: string;

    @Field(() => String)
    @Length(3, 64)
    username!: string;

    @Field(() => String)
    @IsEmail()
    @Length(1, 1024)
    email!: string;

    @Field(() => String)
    @MinLength(8)
    @MaxLength(2048)
    password!: string;
}

@InputType()
export class LoginInput implements Partial<User> {
    @Field(() => String)
    @IsEmail()
    @Length(1, 1024)
    email!: string;

    @Field(() => String)
    @MinLength(8)
    @MaxLength(2048)
    password!: string;
}

export enum InputActivityType {
    WATCHING = 'watching',
    DROPPED = 'dropped',
    PLANNING = 'planning',
    COMPLETED = 'completed'
}

registerEnumType(InputActivityType, {
    name: "InputActivityType", 
    description: "Describes state in that will specific anime be"
});

@InputType()
export class ToggleInput {
    @Field(() => String)
    @IsObjectId({
        message: "This anime id is not valid!"
    })
    animeId!: string;

    @Field(() => InputActivityType)
    type!: InputActivityType;
}

@InputType()
export class FetchUserListInput {
    @Field(() => InputActivityType, {
        nullable: true,
        defaultValue: InputActivityType.COMPLETED
    })
    type!: InputActivityType;

    @Field(() => Number, {
        nullable: true,
        defaultValue: 1
    })
    @Min(1)
    page!: number;

    @Field(() => Number, {
        nullable: true,
        defaultValue: 10
    })
    @Min(1)
    @Max(25)
    perPage!: number;
}

@InputType()
export class ListInput {
    @Field(() => InputActivityType, {
        defaultValue:  InputActivityType.WATCHING,
        nullable: true
    })
    type: InputActivityType = InputActivityType.WATCHING;

    @Field(() => Number, {
        nullable: true
    })
    @Min(1)
    page?: number;

    @Field(() => Number, {
        nullable: true
    })
    @Min(1)
    @Max(25)
    perPage?: number;
}

@ObjectType()
class FieldError {
    @Field(() => String, {
        nullable: true
    })
    field?: string;

    @Field(() => String)
    message!: string;
}

@ObjectType()
export class AuthResponse {
    @Field(() => [FieldError], {
        nullable: true
    })
    errors?: FieldError[]

    @Field(() => User, {
        nullable: true
    })
    user?: User
}

@ObjectType()
export class MeResponse {
    @Field(() => User, {
        nullable: true
    })
    user?: User;

    @Field(() => [FieldError], {
        nullable: true
    })
    errors?: FieldError[];
}

@ObjectType()
export class ToggleResponse {
    @Field(() => Boolean, {
        nullable: true
    })
    success?: boolean;

    @Field(() => [FieldError], {
        nullable: true
    })
    errors?: FieldError[];
}