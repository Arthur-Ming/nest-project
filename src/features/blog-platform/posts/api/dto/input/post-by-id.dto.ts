import { IsPostExist } from '../../../decorators/validate/is-post-exist';
import { IsValidDbId } from '../../../../../../common/decorators/validate/is-valid-db-id';

export class PostByIdDto {
  @IsPostExist()
  @IsValidDbId()
  id: string;
}
