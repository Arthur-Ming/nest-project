import { IsBlogExist } from '../../../decorators/validate/is-blog-exist';
import { IsUUID } from 'class-validator';
import { IsPostExist } from '../../../../posts/decorators/validate/is-post-exist';

export class PostForBlogByIdDto {
  @IsBlogExist()
  @IsUUID()
  blogId: string;

  @IsPostExist()
  @IsUUID()
  postId: string;
}
