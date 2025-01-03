import { CreatePostForSpecifiedBlogDto } from './create-post-for-specified-blog.dto';
import { IsNotEmpty } from 'class-validator';
import { IsBlogByIdExist } from '../../../../blogs/decorators/validate/is-blog-by-id-exist';
import { IsValidDbId } from '../../../../../../common/decorators/validate/is-valid-db-id';

export class CreatePostDto extends CreatePostForSpecifiedBlogDto {
  @IsBlogByIdExist()
  @IsValidDbId()
  @IsNotEmpty()
  blogId: string;
}
