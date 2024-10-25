import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepoPg } from '../../infrastructure/users.repo.pg';

@ValidatorConstraint({ name: 'IsUserExistConstraint', async: true })
@Injectable()
export class IsUserExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepoPg) {}
  async validate(id: string) {
    const isExists = await this.usersRepo.existsById(id);
    console.log(isExists);
    if (!isExists) {
      throw new NotFoundException();
    }
    return true;
  }
}
export function IsUserExist(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'BlogIsExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsUserExistConstraint,
    });
  };
}
