import { BlogOutputData } from '../../../src/features/blogs/api/models/output/blogs.output.model';
import { AddBlogInputModel } from '../../../src/features/blogs/api/models/input/add-blog.input.model';

export function createBlog(dto: AddBlogInputModel): BlogOutputData {
  return {
    id: Number(new Date()).toString(),
    name: dto.name,
    description: dto.description,
    websiteUrl: dto.websiteUrl,
    createdAt: new Date().toISOString(),
    isMembership: false,
  };
}
