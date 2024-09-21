import { Trim } from '../../../../../common/decorators/transform/trim';
import { IsEmail, IsString } from 'class-validator';
import { IsConfirmExistByEmail } from '../../../decorators/validate/is-confirm-exist-by-email';

export class RegistrationEmailResendingDto {
  @IsConfirmExistByEmail()
  @Trim()
  @IsEmail()
  @IsString()
  email: string;
}
