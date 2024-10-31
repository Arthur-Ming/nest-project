import { CreatePostForSpecifiedBlogDto } from './create-post-for-specified-blog.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { IsBlogByIdExist } from '../../../../blogs/decorators/validate/is-blog-by-id-exist';

export class CreatePostDto extends CreatePostForSpecifiedBlogDto {
  @IsBlogByIdExist()
  @IsUUID()
  @IsNotEmpty()
  blogId: string;
}
