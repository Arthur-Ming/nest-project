import { IsNotEmpty } from 'class-validator';
import { IsLikeStatus } from '../../../../../../common/decorators/validate/is-like-status';
import { LikesStatusEnum } from '../../../../../../common/enum/likes-status.enum';

export class LikePostDto {
  @IsLikeStatus()
  @IsNotEmpty()
  likeStatus: LikesStatusEnum;
}
