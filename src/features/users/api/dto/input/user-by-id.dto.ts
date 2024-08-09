import { IsMongoId } from 'class-validator';
import { IsUserExist } from '../../../decorators/validate/is-user-exist';

export class UserByIdDto {
  @IsUserExist()
  @IsMongoId()
  id: string;
}
