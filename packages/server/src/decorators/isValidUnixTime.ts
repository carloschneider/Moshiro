import { 
    registerDecorator, 
    ValidationOptions, 
    ValidationArguments 
} from 'class-validator';

export function IsValidUnixTime(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidUnixTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
            return (new Date(value)).getTime() > 0;
        },
      },
    });
  };
}