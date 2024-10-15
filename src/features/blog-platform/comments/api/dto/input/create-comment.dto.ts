import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../common/decorators/transform/trim';

export class CreateCommentDto {
  @Trim()
  @Length(20, 300)
  @IsString()
  @IsNotEmpty()
  content: string;
}
