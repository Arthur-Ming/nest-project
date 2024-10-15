import { IsCommentExist } from '../../../decorators/validate/is-comment-exist';
import { IsValidDbId } from '../../../../../../common/decorators/validate/is-valid-db-id';

export class CommentByIdDto {
  @IsCommentExist()
  @IsValidDbId()
  id: string;
}
