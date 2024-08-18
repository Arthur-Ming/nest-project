import { registerDecorator, ValidationOptions } from 'class-validator';
import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export function IsValidDbId(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDbId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const s = ObjectId.isValid(value);
          if (!s) {
            throw new NotFoundException('Not Found');
          }
          return s;
        },
      },
    });
  };
}
