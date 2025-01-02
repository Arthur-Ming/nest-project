import { registerDecorator, ValidationOptions } from 'class-validator';
import { NotFoundException } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

export function IsValidDbId(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDbId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const isValid = uuidValidate(value);
          if (!isValid) {
            throw new NotFoundException('Not Found');
          }
          return true;
        },
      },
    });
  };
}
