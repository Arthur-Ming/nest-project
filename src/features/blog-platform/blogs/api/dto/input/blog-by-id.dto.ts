import { IsBlogExist } from '../../../decorators/validate/is-blog-exist';
import { IsUUID } from 'class-validator';

export class BlogByIdDto {
  @IsBlogExist()
  @IsUUID()
  blogId: string;
}
