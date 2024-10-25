import { IsUserExist } from '../../../decorators/validate/is-user-exist';
import { IsUUID } from 'class-validator';

export class UserByIdDto {
  @IsUserExist()
  @IsUUID()
  id: string;
}
