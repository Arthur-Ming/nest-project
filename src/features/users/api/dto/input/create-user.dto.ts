import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';
import { PasswordValidate } from '../../../../../common/decorators/validate/password-validate';
import { IsUserExistByLogin } from '../../../decorators/validate/is-user-exist-by-login';
import { IsUserExistByEmail } from '../../../decorators/validate/is-user-exist-by-email';

export class CreateUserDto {
  @IsUserExistByLogin()
  @Trim()
  @Length(3, 10)
  @IsString()
  login: string;

  @Trim()
  @PasswordValidate()
  @Length(6, 20)
  @IsString()
  password: string;

  @IsUserExistByEmail()
  @Trim()
  @IsEmail()
  @IsString()
  email: string;
}
