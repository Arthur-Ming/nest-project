import { Injectable } from '@nestjs/common';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { CreateBlogDto } from '../api/dto/input/create-blog.dto';
import { CreatePostForSpecifiedBlogDto } from '../../posts/api/dto/input/create-post-for-specified-blog.dto';
import { PostsService } from '../../posts/application/posts.service';
import { UpdateBlogDto } from '../api/dto/input/update-blog.dto';
import { InterlayerNotice } from '../../../base/result/result';
import { ResultStatusEnum } from '../../../base/result/result-status.enum';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepo: BlogsRepo,
    private postsService: PostsService
  ) {}
  async addBlog(input: CreateBlogDto): Promise<InterlayerNotice<{ newBlogId: string }>> {
    const newBlogId = await this.blogsRepo.add({
      name: input.name,
      websiteUrl: input.websiteUrl,
      description: input.description,
      createdAt: Number(new Date()),
      isMembership: false,
    });
    return new InterlayerNotice(ResultStatusEnum.Success, { newBlogId });
  }

  async addPostSpecificBlog(blogId: string, dto: CreatePostForSpecifiedBlogDto) {
    const { id } = await this.postsService.addPost({
      ...dto,
      blogId,
    });
    return id;
  }
  async updateBlog(blogId: string, updateBlogDTO: UpdateBlogDto) {
    await this.blogsRepo.update(blogId, updateBlogDTO);
  }

  async deleteBlog(blogId: string) {
    await this.blogsRepo.remove(blogId);
  }
}
