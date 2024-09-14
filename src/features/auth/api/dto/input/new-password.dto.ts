import { Trim } from '../../../../../common/decorators/transform/trim';
import { PasswordValidate } from '../../../../../common/decorators/validate/password-validate';
import { IsString, Length } from 'class-validator';

export class NewPasswordDto {
  @Trim()
  @PasswordValidate()
  @Length(6, 20)
  @IsString()
  newPassword: string;

  @Trim()
  recoveryCode: string;
}
