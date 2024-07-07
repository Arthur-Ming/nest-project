import { Injectable } from '@nestjs/common';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { AddBlogInputModel } from '../api/models/input/add-blog.input.model';
import { UpdateBlogInputModel } from '../api/models/input/update-blog.input.model';
import { mapToUpdateBlogDto } from './utils/map-to-update-blog-dto';
import { AddPostInputModel } from '../../posts/api/models/input/add-post.input.model';
import { PostsService } from '../../posts/application/posts.service';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepo: BlogsRepo,
    private postsService: PostsService
  ) {}
  async addBlog(input: AddBlogInputModel) {
    const newBlogId = await this.blogsRepo.add({
      name: input.name,
      websiteUrl: input.websiteUrl,
      description: input.description,
      createdAt: Number(new Date()),
      isMembership: false,
    });
    return newBlogId;
  }

  async addPostSpecificBlog(blogId: string, addPostInputModel: AddPostInputModel) {
    const { id } = await this.postsService.addPost({
      ...addPostInputModel,
      blogId,
    });
    return id;
  }
  async updateBlog(blogId: string, updateBlogModel: UpdateBlogInputModel) {
    const updateBlogDTO = mapToUpdateBlogDto(updateBlogModel);

    await this.blogsRepo.update(blogId, updateBlogDTO);
  }

  async deleteBlog(blogId: string) {
    await this.blogsRepo.remove(blogId);
  }
}