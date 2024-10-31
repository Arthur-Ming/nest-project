import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EmailConfirmationRepo } from '../../infrastructure/email-confirmation.repo';
import { UsersService } from '../../../users/application/users.service';

@ValidatorConstraint({ name: 'IsConfirmExistByEmailConstraint', async: true })
@Injectable()
export class IsConfirmExistByEmailConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailConfirmationRepo: EmailConfirmationRepo
  ) {}
  async validate(email: string) {
    const user = await this.usersService.findByEmail(email);

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
