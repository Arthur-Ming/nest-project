import { registerDecorator, ValidationOptions } from 'class-validator';
import { SortDirections } from '../../enum/sort-directions';

export function IsSortDirection(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSortDirection',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        ...validationOptions,
        message: 'SortDirection must be asc or desc',
      },
      validator: {
        validate(value: any) {
          const s = SortDirections.hasOwnProperty(value);
          if (!s) {
            return false;
          }
          return s;
        },
      },
    });
  };
}
