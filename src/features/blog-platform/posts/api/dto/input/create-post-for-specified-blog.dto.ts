import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim';

export class CreatePostForSpecifiedBlogDto {
  @Trim()
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  title: string;

  @Trim()
  @Length(3, 100)
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @Trim()
  @Length(3, 1000)
  @IsString()
  @IsNotEmpty()
  content: string;
}
