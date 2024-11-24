import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../api/dto/input/create-blog.dto';
import { InterlayerNotice } from '../../../../base/result/result';
import { ResultStatusEnum } from '../../../../base/result/result-status.enum';
import { UpdateBlogDto } from '../api/dto/input/update-blog.dto';
import { PostsService } from '../../posts/application/posts.service';
import { CreatePostForSpecifiedBlogDto } from '../../posts/api/dto/input/create-post-for-specified-blog.dto';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { UpdatePostDto } from '../../posts/api/dto/input/update-post.dto';
import { PostsRepo } from '../../posts/infrastructure/posts.repo';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepoPg: BlogsRepo,
    private readonly postsRepo: PostsRepo,
    private postsService: PostsService
  ) {}
  async addBlog(input: CreateBlogDto): Promise<InterlayerNotice<{ newBlogId: string }>> {
    const newBlogId = await this.blogsRepoPg.add({
      name: input.name,
      websiteUrl: input.websiteUrl,
      description: input.description,
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
    await this.blogsRepoPg.update(blogId, updateBlogDTO);
  }

  async updatePost(blogId: string, postId: string, updatePostDTO: UpdatePostDto) {
    await this.postsRepo.update(blogId, postId, updatePostDTO);
  }

  async deletePost(blogId: string, postId: string) {
    const isPostExist = await this.postsRepo.existsForSpecificBlog(blogId, postId);
    if (!isPostExist) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }
    await this.postsRepo.remove(blogId, postId);
    return new InterlayerNotice(ResultStatusEnum.Success);
  }

  async deleteBlog(blogId: string) {
    await this.blogsRepoPg.remove(blogId);
  }
}
