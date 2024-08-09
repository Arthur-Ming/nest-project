import { CreatePostForSpecifiedBlogDto } from './create-post-for-specified-blog.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreatePostDto extends CreatePostForSpecifiedBlogDto {
  @IsMongoId()
  @IsNotEmpty()
  blogId: string;
}
