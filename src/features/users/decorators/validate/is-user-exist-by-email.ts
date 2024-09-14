import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../../infrastructure/users.repo';

@ValidatorConstraint({ name: 'IsUserExistByEmailConstraint', async: true })
@Injectable()
export class IsUserExistByEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepo) {}
  async validate(email: string) {
    const isExists = await this.usersRepo.existsByEmail(email);

    return !isExists;
  }
}
export function IsUserExistByEmail(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUserExistByEmail',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: { ...validationOptions, message: 'User already exists' },
      validator: IsUserExistByEmailConstraint,
    });
  };
}
