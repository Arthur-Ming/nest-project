import { BlogOutputData } from '../../../src/features/blogs/api/dto/output/blogs.output.model';
import { CreateBlogDto } from '../../../src/features/blogs/api/dto/input/create-blog.dto';

export function createBlog(dto: CreateBlogDto): BlogOutputData {
  return {
    id: Number(new Date()).toString(),
    name: dto.name,
    description: dto.description,
    websiteUrl: dto.websiteUrl,
    createdAt: new Date().toISOString(),
    isMembership: false,
  };
}
