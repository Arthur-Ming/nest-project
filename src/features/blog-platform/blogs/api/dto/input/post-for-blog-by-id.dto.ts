import { IsBlogExist } from '../../../decorators/validate/is-blog-exist';
import { IsPostExist } from '../../../../posts/decorators/validate/is-post-exist';
import { IsValidDbId } from '../../../../../../common/decorators/validate/is-valid-db-id';

export class PostForBlogByIdDto {
  @IsBlogExist()
  @IsValidDbId()
  blogId: string;

  @IsPostExist()
  @IsValidDbId()
  postId: string;
}
