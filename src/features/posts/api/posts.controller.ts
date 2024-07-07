import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepo } from '../infrastructure/posts.query-repo';
import { AddPostInputModel, WithBlogId } from './models/input/add-post.input.model';
import { PostsQueryParamsInputModel } from './models/input/posts-query-params.input.model';

import { UpdatePostInputModel } from './models/input/update-post.input.model';
import { setPagination } from '../../../utils/set-pagination';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepo: PostsQueryRepo
  ) {}
  @Get()
  async getAll(
    @Query()
    queryParams: PostsQueryParamsInputModel
  ) {
    return await this.postsQueryRepo.findAll(setPagination(queryParams));
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return await this.postsQueryRepo.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addBlog(@Body() addPostInputModel: WithBlogId<AddPostInputModel>) {
    const { id } = await this.postsService.addPost(addPostInputModel);
    return await this.postsQueryRepo.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() updatePostModel: UpdatePostInputModel) {
    await this.postsService.updatePost(id, updatePostModel);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    await this.postsService.deletePost(id);
  }
}
