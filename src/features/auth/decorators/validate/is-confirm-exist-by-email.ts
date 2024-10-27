import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepoPg } from '../../../users/infrastructure/users.repo.pg';
import { EmailConfirmationRepoPg } from '../../infrastructure/email-confirmation.repo.pg';

@ValidatorConstraint({ name: 'IsConfirmExistByEmailConstraint', async: true })
@Injectable()
export class IsConfirmExistByEmailConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly usersRepo: UsersRepoPg,
    private readonly emailConfirmationRepo: EmailConfirmationRepoPg
  ) {}
  async validate(email: string) {
    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      return false;
    }
    const confirm = await this.emailConfirmationRepo.findByUserId(user.id.toString());
    console.log('confirm');
    console.log(confirm);
    console.log(confirm.isConfirmed);
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
