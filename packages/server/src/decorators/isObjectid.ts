import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ObjectId } from '@mikro-orm/mongodb';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
            return ObjectId.isValid(value);
        },
      },
    });
  };
}