import { Trim } from '../../../../../common/decorators/transform/trim';

export class LoginUserDto {
  @Trim()
  loginOrEmail: string;

  @Trim()
  password: string;
}
