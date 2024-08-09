import { IsMongoId } from 'class-validator';
import { IsPostExist } from '../../../decorators/validate/is-post-exist';

export class PostByIdDto {
  @IsPostExist()
  @IsMongoId()
  id: string;
}
