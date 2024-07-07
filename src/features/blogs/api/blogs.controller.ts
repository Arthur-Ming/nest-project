import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepo } from '../infrastructure/blogs.query-repo';
import { BlogsQueryParams } from './models/input/blogs-query-params.input.model';
import { AddBlogInputModel } from './models/input/add-blog.input.model';
import { UpdateBlogInputModel } from './models/input/update-blog.input.model';
import { AddPostInputModel } from '../../posts/api/models/input/add-post.input.model';
import { PostsQueryRepo } from '../../posts/infrastructure/posts.query-repo';
import { PostsQueryParamsInputModel } from '../../posts/api/models/input/posts-query-params.input.model';
import { setPagination } from '../../../utils/set-pagination';
import { BlogsRepo } from '../infrastructure/blogs.repo';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsRepo: BlogsRepo,
    private blogsQueryRepo: BlogsQueryRepo,
    private postsQueryRepo: PostsQueryRepo
  ) {}
  @Get()
  getBlogs(
    @Query()
    queryParams: BlogsQueryParams
  ) {
    return this.blogsQueryRepo.findAll(setPagination(queryParams));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlogById(@Param('id') id: string) {
    const existsBlog = await this.blogsRepo.existsById(id);

    if (!existsBlog) {
      throw new HttpException(`Blog with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return await this.blogsQueryRepo.findById(id);
  }
  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  async getPostsSpecificBlog(
    @Param('id') id: string,
    @Query()
    queryParams: PostsQueryParamsInputModel
  ) {
    const existsBlog = await this.blogsRepo.existsById(id);

    if (!existsBlog) {
      throw new HttpException(`Blog with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return await this.postsQueryRepo.findAll(setPagination(queryParams), id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addBlog(@Body() addBlogModel: AddBlogInputModel) {
    const addedBlogId = await this.blogsService.addBlog(addBlogModel);
    return await this.blogsQueryRepo.findById(addedBlogId);
  }

  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async addPostSpecificBlog(@Param('id') id: string, @Body() addPostInputModel: AddPostInputModel) {
    const existsBlog = await this.blogsRepo.existsById(id);

    if (!existsBlog) {
      throw new HttpException(`Blog with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    const addedPostId = await this.blogsService.addPostSpecificBlog(id, addPostInputModel);
    return this.postsQueryRepo.findById(addedPostId);
  }
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: string, @Body() updateBlogModel: UpdateBlogInputModel) {
    const existsBlog = await this.blogsRepo.existsById(id);

    if (!existsBlog) {
      throw new HttpException(`Blog with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.blogsService.updateBlog(id, updateBlogModel);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string) {
    const existsBlog = await this.blogsRepo.existsById(id);

    if (!existsBlog) {
      throw new HttpException(`Blog with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.blogsService.deleteBlog(id);
  }
}
