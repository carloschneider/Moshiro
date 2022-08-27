import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';
import { User } from '../entities/user.entity';

@InputType()
export class RegisterInput {
    @Field(() => String)
    username!: string;

    @Field(() => String)
    email!: string;

    @Field(() => String)
    password!: string;
}

@InputType()
export class LoginInput {
    @Field(() => String)
    email!: string;

    @Field(() => String)
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
    animeId!: string;

    @Field(() => InputActivityType)
    type!: InputActivityType;
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
    page?: number;

    @Field(() => Number, {
        nullable: true
    })
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