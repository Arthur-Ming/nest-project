import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';

export class CreateBlogDto {
  @Trim()
  @Length(3, 15)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Trim()
  @Length(3, 500)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Trim()
  @Length(3, 100)
  @IsUrl()
  @IsNotEmpty()
  websiteUrl: string;
}
