import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EmailConfirmationRepo } from '../../infrastructure/email-confirmation.repo';

@ValidatorConstraint({ name: 'IsConfirmExistByEmailConstraint', async: true })
@Injectable()
export class IsConfirmExistByEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly emailConfirmationRepo: EmailConfirmationRepo) {}
  async validate(email: string) {
    const confirm = await this.emailConfirmationRepo.findByEmail(email);
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
