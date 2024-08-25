import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepo } from '../infrastructure/blogs.query-repo';
import { CreateBlogDto } from './dto/input/create-blog.dto';
import { CreatePostForSpecifiedBlogDto } from '../../posts/api/dto/input/create-post-for-specified-blog.dto';
import { PostsQueryRepo } from '../../posts/infrastructure/posts.query-repo';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { UpdateBlogDto } from './dto/input/update-blog.dto';
import { ResultStatusEnum } from '../../../base/result/result-status.enum';
import { BlogByIdDto } from './dto/input/blog-by-id.dto';
import { BlogsPaginationQueryParamsDto } from './dto/input/blogs-pagination-query-params.dto';

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
    queryParams: BlogsPaginationQueryParamsDto
  ) {
    return this.blogsQueryRepo.findByQueryParams(queryParams);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlogById(@Param() params: BlogByIdDto) {
    return await this.blogsQueryRepo.findById(params.id);
  }

  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  async getPostsForSpecificBlog(
    @Param() params: BlogByIdDto,
    @Query()
    queryParams: BlogsPaginationQueryParamsDto
  ) {
    return await this.postsQueryRepo.findAll(queryParams, params.id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const result = await this.blogsService.addBlog(createBlogDto);
    if (result.status === ResultStatusEnum.Success) {
      return await this.blogsQueryRepo.findById(result.getData().newBlogId);
    }
  }

  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async addPostForSpecificBlog(
    @Param() params: BlogByIdDto,
    @Body() createPostForSpecifiedBlogDto: CreatePostForSpecifiedBlogDto
  ) {
    const addedPostId = await this.blogsService.addPostSpecificBlog(
      params.id,
      createPostForSpecifiedBlogDto
    );
    return this.postsQueryRepo.findById(addedPostId);
  }
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param() params: BlogByIdDto, @Body() updateBlogDto: UpdateBlogDto) {
    await this.blogsService.updateBlog(params.id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param() params: BlogByIdDto) {
    await this.blogsService.deleteBlog(params.id);
  }
}
