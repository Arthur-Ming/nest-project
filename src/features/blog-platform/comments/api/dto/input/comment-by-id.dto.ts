import { IsCommentExist } from '../../../decorators/validate/is-comment-exist';
import { IsUUID } from 'class-validator';

export class CommentByIdDto {
  @IsCommentExist()
  @IsUUID()
  id: string;
}
