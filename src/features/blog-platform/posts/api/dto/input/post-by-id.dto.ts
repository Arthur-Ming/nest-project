import { IsPostExist } from '../../../decorators/validate/is-post-exist';
import { IsUUID } from 'class-validator';

export class PostByIdDto {
  @IsPostExist()
  @IsUUID()
  id: string;
}
