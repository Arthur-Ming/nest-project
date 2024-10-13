import { IsValidDbId } from '../../../../../common/decorators/validate/is-valid-db-id';
import { IsCommentExist } from '../../../decorators/validate/is-comment-exist';

export class CommentByIdDto {
  @IsCommentExist()
  @IsValidDbId()
  id: string;
}
