import { Trim } from '../../../../../common/decorators/transform/trim';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @Trim()
  @Length(20, 300)
  @IsString()
  @IsNotEmpty()
  content: string;
}
