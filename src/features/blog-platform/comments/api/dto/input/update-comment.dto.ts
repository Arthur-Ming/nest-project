import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim';

export class UpdateCommentDto {
  @Trim()
  @Length(20, 300)
  @IsString()
  @IsNotEmpty()
  content: string;
}
