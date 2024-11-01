import { ConfirmCodeValidate } from '../../../decorators/validate/confirm-code.validate';
import { IsUUID } from 'class-validator';

export class ConfirmDto {
  @ConfirmCodeValidate()
  @IsUUID()
  code: string;
}
