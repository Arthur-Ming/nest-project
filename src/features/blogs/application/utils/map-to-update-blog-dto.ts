import { UpdateBlogDto } from '../dto/update-blog.dto';
import { UpdateBlogInputModel } from '../../api/models/input/update-blog.input.model';

export function mapToUpdateBlogDto(updateBlogModel: UpdateBlogInputModel): UpdateBlogDto {
  return {
    name: updateBlogModel.name,
    description: updateBlogModel.description,
    websiteUrl: updateBlogModel.websiteUrl,
  };
}
