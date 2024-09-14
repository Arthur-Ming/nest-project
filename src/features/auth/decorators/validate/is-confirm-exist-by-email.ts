import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EmailConfirmationRepo } from '../../infrastructure/email-confirmation.repo';
import { UsersRepo } from '../../../users/infrastructure/users.repo';

@ValidatorConstraint({ name: 'IsConfirmExistByEmailConstraint', async: true })
@Injectable()
export class IsConfirmExistByEmailConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly emailConfirmationRepo: EmailConfirmationRepo
  ) {}
  async validate(email: string) {
    const user = await this.usersRepo.findByLoginOrEmail(email);
    if (!user) {
      return false;
    }
    const confirm = await this.emailConfirmationRepo.findByUserId(user._id.toString());

    if (!confirm || confirm.isConfirmed) {
      return false;
    }
    return true;
  }
}
export function IsConfirmExistByEmail(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsConfirmExistByEmail',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: { ...validationOptions },
      validator: IsConfirmExistByEmailConstraint,
    });
  };
}
