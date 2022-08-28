import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ObjectId } from '@mikro-orm/mongodb';

export function IsObjectIdArr(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isObjectIdArr',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
            let valid: boolean = true;

            value.forEach((el: string) => {
                if(!ObjectId.isValid(el)) {
                    valid = false;
                };
            });

            return valid;
        },
      },
    });
  };
}