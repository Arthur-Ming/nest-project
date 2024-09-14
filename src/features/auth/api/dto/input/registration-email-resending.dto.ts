import { Trim } from '../../../../../common/decorators/transform/trim';
import { IsEmail, IsString } from 'class-validator';
import { IsUserExistByEmail } from '../../../../users/decorators/validate/is-user-exist-by-email';
import { IsConfirmExistByEmail } from '../../../decorators/validate/is-confirm-exist-by-email';

export class RegistrationEmailResendingDto {
  @IsConfirmExistByEmail()
  @IsUserExistByEmail()
  @Trim()
  @IsEmail()
  @IsString()
  email: string;
}
