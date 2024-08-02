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
  HttpException,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepo } from '../infrastructure/posts.query-repo';
import { AddPostInputModel, WithBlogId } from './models/input/add-post.input.model';
import { PostsQueryParamsInputModel } from './models/input/posts-query-params.input.model';

import { UpdatePostInputModel } from './models/input/update-post.input.model';
import { setPagQueryParams } from '../../../utils/set-pag-query-params';
import { PostsRepo } from '../infrastructure/posts.repo';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepo: PostsQueryRepo,
    private postsRepo: PostsRepo
  ) {}
  @Get()
  async getAll(
    @Query()
    queryParams: PostsQueryParamsInputModel
  ) {
    return await this.postsQueryRepo.findAll(setPagQueryParams(queryParams));
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const existsBlog = await this.postsRepo.existsById(id);

    if (!existsBlog) {
      throw new HttpException(`Post with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
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
    const existsBlog = await this.postsRepo.existsById(id);

    if (!existsBlog) {
      throw new HttpException(`Post with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.postsService.updatePost(id, updatePostModel);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    const existsBlog = await this.postsRepo.existsById(id);

    if (!existsBlog) {
      throw new HttpException(`Post with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.postsService.deletePost(id);
  }
}
