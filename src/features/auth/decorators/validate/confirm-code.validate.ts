import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EmailConfirmationRepo } from '../../infrastructure/email-confirmation.repo';

@ValidatorConstraint({ name: 'ConfirmCodeValidateConstraint', async: true })
@Injectable()
export class ConfirmCodeValidateConstraint implements ValidatorConstraintInterface {
  constructor(private readonly emailConfirmationRepo: EmailConfirmationRepo) {}
  async validate(code: string) {
    const confirmation = await this.emailConfirmationRepo.findByConfirmationCode(code);

    if (
      !confirmation ||
      confirmation.isConfirmed ||
      confirmation.expirationDate < Number(new Date())
    ) {
      return false;
    }
    return true;
  }
}
export function ConfirmCodeValidate(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ConfirmCodeValidate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: { ...validationOptions, message: 'Confirm code is not valid' },
      validator: ConfirmCodeValidateConstraint,
    });
  };
}
