import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EmailConfirmationRepoPg } from '../../infrastructure/email-confirmation.repo.pg';

@ValidatorConstraint({ name: 'ConfirmCodeValidateConstraint', async: true })
@Injectable()
export class ConfirmCodeValidateConstraint implements ValidatorConstraintInterface {
  constructor(private readonly emailConfirmationRepo: EmailConfirmationRepoPg) {}
  async validate(code: string) {
    const confirmation = await this.emailConfirmationRepo.findByConfirmationCode(code);

    if (
      !confirmation ||
      confirmation.isConfirmed ||
      Number(confirmation.exp) < Number(new Date())
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
