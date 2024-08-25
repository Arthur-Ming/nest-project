import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../../infrastructure/users.repo';

@ValidatorConstraint({ name: 'IsUserExistByLoginConstraint', async: true })
@Injectable()
export class IsUserExistByLoginConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepo) {}
  async validate(login: string) {
    const isExists = await this.usersRepo.existsByLogin(login);

    return !isExists;
  }
}
export function IsUserExistByLogin(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUserExistByLogin',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: { ...validationOptions, message: 'User already exists' },
      validator: IsUserExistByLoginConstraint,
    });
  };
}
