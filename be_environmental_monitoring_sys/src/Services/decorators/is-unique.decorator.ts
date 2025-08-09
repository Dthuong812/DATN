import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueValidator } from '../validators/is-unique.validator';


export function IsUnique(entity: any, property?: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, property],
      validator: IsUniqueValidator,
    });
  };
}