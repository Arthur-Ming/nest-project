import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';
import { PasswordValidate } from '../../../../../common/decorators/validate/password-validate';

export class CreateUserDto {
  @Trim()
  @Length(3, 10)
  @IsString()
  login: string;

  @Trim()
  @PasswordValidate()
  @Length(6, 20)
  @IsString()
  password: string;

  @Trim()
  @IsEmail()
  @IsString()
  email: string;
}
