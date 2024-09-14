import { Trim } from '../../../../../common/decorators/transform/trim';
import { IsEmail, IsString } from 'class-validator';

export class PasswordRecoveryDto {
  @Trim()
  @IsEmail()
  @IsString()
  email: string;
}
