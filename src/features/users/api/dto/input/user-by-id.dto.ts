import { IsUserExist } from '../../../decorators/validate/is-user-exist';
import { IsValidDbId } from '../../../../../common/decorators/validate/is-valid-db-id';

export class UserByIdDto {
  @IsUserExist()
  @IsValidDbId()
  id: string;
}
