import { Injectable } from '@nestjs/common';
import { BlogInputBody } from '../api/models/input/blogs.input.model';
import { BlogsRepo } from '../infrastructure/blogs.repo';

@Injectable()
export class BlogsService {
  constructor(private blogsRepo: BlogsRepo) {}
  async addBlog(input: BlogInputBody) {
    const newBlog = await this.blogsRepo.add({
      name: input.name,
      websiteUrl: input.websiteUrl,
      description: input.description,
      createdAt: Number(new Date()),
      isMembership: false,
    });
    return newBlog;
  }
}
