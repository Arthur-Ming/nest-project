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
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepo } from '../infrastructure/blogs.query-repo';
import { CreateBlogDto } from './dto/input/create-blog.dto';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { UpdateBlogDto } from './dto/input/update-blog.dto';
import { BlogByIdDto } from './dto/input/blog-by-id.dto';
import { BlogsPaginationQueryParamsDto } from './dto/input/blogs-pagination-query-params.dto';
import { BlogsRoutes } from '../routes/blogs-routes';
import { SkipThrottle } from '@nestjs/throttler';
import { ExtractAccessToken } from '../../../auth/decorators/extract-access-token';
import { DecodeJwtTokenPipe } from '../../../auth/pipes/decode-jwt-token.pipe';
import { AccessTokenPayloadDto } from '../../../auth/api/dto/output/access-token-payload.dto';

import { ResultStatusEnum } from '../../../../base/result/result-status.enum';
import { PostsQueryRepo } from '../../posts/infrastructure/posts.query-repo';
import { CreatePostForSpecifiedBlogDto } from '../../posts/api/dto/input/create-post-for-specified-blog.dto';
import { BasicAuthGuard } from '../../../auth/guards/basic-auth.guard';

@SkipThrottle()
@Controller(BlogsRoutes.base)
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

  @Get(BlogsRoutes.byId)
  @HttpCode(HttpStatus.OK)
  async getBlogById(@Param() params: BlogByIdDto) {
    return await this.blogsQueryRepo.findById(params.id);
  }

  @Get(BlogsRoutes.postsForSpecificBlog)
  @HttpCode(HttpStatus.OK)
  async getPostsForSpecificBlog(
    @Param() params: BlogByIdDto,
    @Query()
    queryParams: BlogsPaginationQueryParamsDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto | null
  ) {
    const userId = payload ? payload.userId : null;
    return await this.postsQueryRepo.findAll(queryParams, userId, params.id);
  }
  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const result = await this.blogsService.addBlog(createBlogDto);
    if (result.status === ResultStatusEnum.Success) {
      return await this.blogsQueryRepo.findById(result.getData().newBlogId);
    }
  }

  @UseGuards(BasicAuthGuard)
  @Post(BlogsRoutes.postsForSpecificBlog)
  @HttpCode(HttpStatus.CREATED)
  async addPostForSpecificBlog(
    @Param() params: BlogByIdDto,
    @Body() createPostForSpecifiedBlogDto: CreatePostForSpecifiedBlogDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto
  ) {
    const addedPostId = await this.blogsService.addPostSpecificBlog(
      params.id,
      createPostForSpecifiedBlogDto
    );
    const userId = payload ? payload.userId : null;
    return this.postsQueryRepo.findById(addedPostId, userId);
  }
  @UseGuards(BasicAuthGuard)
  @Put(BlogsRoutes.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param() params: BlogByIdDto, @Body() updateBlogDto: UpdateBlogDto) {
    await this.blogsService.updateBlog(params.id, updateBlogDto);
  }
  @UseGuards(BasicAuthGuard)
  @Delete(BlogsRoutes.byId)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param() params: BlogByIdDto) {
    await this.blogsService.deleteBlog(params.id);
  }
}
