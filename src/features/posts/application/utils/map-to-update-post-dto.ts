import { UpdatePostInputModel } from '../../api/models/input/update-post.input.model';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ObjectId } from 'mongodb';

export function mapToUpdatePostDto(input: UpdatePostInputModel): UpdatePostDto {
  return {
    title: input.title,
    shortDescription: input.shortDescription,
    content: input.content,
    blogId: new ObjectId(input.blogId),
  };
}
