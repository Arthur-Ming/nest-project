import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';

export enum CreateBlogFields {
  name = 'name',
  description = 'description',
  websiteUrl = 'websiteUrl',
}
export class CreateBlogDto {
  @Trim()
  @Length(3, 15)
  @IsString()
  @IsNotEmpty()
  [CreateBlogFields.name]: string;

  @Trim()
  @Length(3, 500)
  @IsString()
  @IsNotEmpty()
  [CreateBlogFields.description]: string;

  @Trim()
  @Length(3, 100)
  @IsUrl()
  @IsNotEmpty()
  [CreateBlogFields.websiteUrl]: string;
}
