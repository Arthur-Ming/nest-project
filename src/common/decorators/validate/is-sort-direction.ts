import { registerDecorator, ValidationOptions } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { SortDirections } from '../../types/enum';

export function IsSortDirection(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSortDirection',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const s = SortDirections.hasOwnProperty(value);
          if (!s) {
            throw new BadRequestException('SortDirection must be asc or desc ');
          }
          return s;
        },
      },
    });
  };
}
