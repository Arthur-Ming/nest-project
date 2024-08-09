import { IsMongoId } from 'class-validator';
import { IsBlogExist } from '../../../decorators/validate/is-blog-exist';

export class BlogByIdDto {
  @IsBlogExist()
  @IsMongoId()
  id: string;
}
