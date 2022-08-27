import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsImageFormat(property: string | string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isImageFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          switch(value.charAt(0)) {
            case '/':
                return typeof property === 'string' 
                    ? property == 'jpg' 
                    : property.includes('jpg');
                break;
            
            case 'i':
                return typeof property === 'string'
                    ? property == 'png'
                    : property.includes('png')
                break;

            case 'R':
                return typeof property === 'string'
                    ? property == 'gif'
                    : property.includes('gif');
                break;

            case 'U':
                return typeof property === 'string'
                    ? property == 'webm'
                    : property.includes('webm');
                break;

            default:
                return false;
                break;
          }
        },
      },
    });
  };
}