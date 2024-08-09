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
import { UpdatePostDto } from './dto/input/update-post.dto';
import { CreatePostDto } from './dto/input/create-post.dto';
import { PostByIdDto } from './dto/input/post-by-id.dto';
import { PostsQueryParamsDto } from './dto/input/posts-query-params.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepo: PostsQueryRepo
  ) {}
  @Get()
  async getAll(
    @Query()
    queryParams: PostsQueryParamsDto
  ) {
    return await this.postsQueryRepo.findAll(queryParams);
  }

  @Get(':id')
  async getBlogById(@Param() params: PostByIdDto) {
    return await this.postsQueryRepo.findById(params.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() createPostDto: CreatePostDto) {
    const { id } = await this.postsService.addPost(createPostDto);
    return await this.postsQueryRepo.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param() params: PostByIdDto, @Body() updatePostDto: UpdatePostDto) {
    await this.postsService.updatePost(params.id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param() params: PostByIdDto) {
    await this.postsService.deletePost(params.id);
  }
}
