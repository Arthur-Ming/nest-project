import { IsBlogExist } from '../../../decorators/validate/is-blog-exist';
import { IsValidDbId } from '../../../../../common/decorators/validate/is-valid-db-id';

export class BlogByIdDto {
  @IsBlogExist()
  @IsValidDbId()
  id: string;
}
