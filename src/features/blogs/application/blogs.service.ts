import { Injectable } from '@nestjs/common';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { AddBlogInputModel } from '../api/models/input/add-blog.input.model';
import { UpdateBlogInputModel } from '../api/models/input/update-blog.input.model';
import { mapToUpdateBlogDto } from './utils/map-to-update-blog-dto';

@Injectable()
export class BlogsService {
  constructor(private blogsRepo: BlogsRepo) {}
  async addBlog(input: AddBlogInputModel) {
    const newBlog = await this.blogsRepo.add({
      name: input.name,
      websiteUrl: input.websiteUrl,
      description: input.description,
      createdAt: Number(new Date()),
      isMembership: false,
    });
    return newBlog;
  }
  async updateBlog(blogId: string, updateBlogModel: UpdateBlogInputModel) {
    const updateBlogDTO = mapToUpdateBlogDto(updateBlogModel);

    await this.blogsRepo.update(blogId, updateBlogDTO);
  }

  async deleteBlog(blogId: string) {
    await this.blogsRepo.remove(blogId);
  }
}
