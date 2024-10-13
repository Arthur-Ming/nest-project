import { CreatePostForSpecifiedBlogDto } from './create-post-for-specified-blog.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { IsBlogByIdExist } from '../../../../blogs/decorators/validate/is-blog-by-id-exist';

export class CreatePostDto extends CreatePostForSpecifiedBlogDto {
  @IsBlogByIdExist()
  @IsMongoId()
  @IsNotEmpty()
  blogId: string;
}
