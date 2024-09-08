import { ConfirmCodeValidate } from '../../../decorators/validate/confirm-code.validate';

export class ConfirmDto {
  @ConfirmCodeValidate()
  code: string;
}
