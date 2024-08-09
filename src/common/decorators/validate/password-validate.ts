import { registerDecorator, ValidationOptions } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export function PasswordValidate(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'passwordValidate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const isValid = /^[a-zA-Z0-9_-]*$/.test(value);
          if (!isValid) {
            throw new BadRequestException(`Incorrect password`);
          }
          return isValid;
        },
      },
    });
  };
}
