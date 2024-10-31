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
import { CreateBlogDto } from './dto/input/create-blog.dto';
import { UpdateBlogDto } from './dto/input/update-blog.dto';
import { BlogByIdDto } from './dto/input/blog-by-id.dto';
import { BlogsPaginationQueryParamsDto } from './dto/input/blogs-pagination-query-params.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { ExtractAccessToken } from '../../../auth/decorators/extract-access-token';
import { DecodeJwtTokenPipe } from '../../../auth/pipes/decode-jwt-token.pipe';
import { AccessTokenPayloadDto } from '../../../auth/api/dto/output/access-token-payload.dto';
import { ResultStatusEnum } from '../../../../base/result/result-status.enum';
import { PostsQueryRepo } from '../../posts/infrastructure/posts.query-repo';
import { CreatePostForSpecifiedBlogDto } from '../../posts/api/dto/input/create-post-for-specified-blog.dto';
import { BasicAuthGuard } from '../../../auth/guards/basic-auth.guard';
import { BlogsQueryRepo } from '../infrastructure/blogs.query-repo';
import { UpdatePostDto } from '../../posts/api/dto/input/update-post.dto';
import { PostForBlogByIdDto } from './dto/input/post-for-blog-by-id.dto';

@SkipThrottle()
@Controller()
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepoPg: BlogsQueryRepo,
    private postsQueryRepo: PostsQueryRepo,
    private postsQueryRepoPg: PostsQueryRepo
  ) {}
  @Get('blogs')
  getBlogs(
    @Query()
    queryParams: BlogsPaginationQueryParamsDto
  ) {
    return this.blogsQueryRepoPg.findByQueryParams(queryParams);
  }

  @Get('blogs/:blogId')
  @HttpCode(HttpStatus.OK)
  async getBlogById(@Param() params: BlogByIdDto) {
    return await this.blogsQueryRepoPg.findById(params.blogId);
  }

  @Get('blogs/:blogId/posts')
  @HttpCode(HttpStatus.OK)
  async getPostsForSpecificBlog(
    @Param() params: BlogByIdDto,
    @Query()
    queryParams: BlogsPaginationQueryParamsDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto | null
  ) {
    const userId = payload ? payload.userId : null;
    return await this.postsQueryRepoPg.findAll(queryParams, userId, params.blogId);
  }

  @UseGuards(BasicAuthGuard)
  @Get('sa/blogs')
  getBlogsSA(
    @Query()
    queryParams: BlogsPaginationQueryParamsDto
  ) {
    return this.blogsQueryRepoPg.findByQueryParams(queryParams);
  }

  @UseGuards(BasicAuthGuard)
  @Post('sa/blogs')
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const result = await this.blogsService.addBlog(createBlogDto);
    if (result.status === ResultStatusEnum.Success) {
      return await this.blogsQueryRepoPg.findById(result.getData().newBlogId);
    }
  }

  @UseGuards(BasicAuthGuard)
  @Put('sa/blogs/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param() params: BlogByIdDto, @Body() updateBlogDto: UpdateBlogDto) {
    await this.blogsService.updateBlog(params.blogId, updateBlogDto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('sa/blogs/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param() params: BlogByIdDto) {
    await this.blogsService.deleteBlog(params.blogId);
  }

  @UseGuards(BasicAuthGuard)
  @Post('sa/blogs/:blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  async addPostForSpecificBlog(
    @Param() params: BlogByIdDto,
    @Body() createPostForSpecifiedBlogDto: CreatePostForSpecifiedBlogDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto
  ) {
    const addedPostId = await this.blogsService.addPostSpecificBlog(
      params.blogId,
      createPostForSpecifiedBlogDto
    );
    const userId = payload ? payload.userId : null;
    return this.postsQueryRepoPg.findById(addedPostId, userId);
  }

  @UseGuards(BasicAuthGuard)
  @Get('sa/blogs/:blogId/posts')
  @HttpCode(HttpStatus.OK)
  async getPostsForSpecificBlogSA(
    @Param() params: BlogByIdDto,
    @Query()
    queryParams: BlogsPaginationQueryParamsDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto | null
  ) {
    const userId = payload ? payload.userId : null;
    return await this.postsQueryRepoPg.findAll(queryParams, userId, params.blogId);
  }

  @UseGuards(BasicAuthGuard)
  @Put('sa/blogs/:blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param() params: PostForBlogByIdDto, @Body() updatePostDto: UpdatePostDto) {
    await this.blogsService.updatePost(params.blogId, params.postId, updatePostDto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('sa/blogs/:blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param() params: PostForBlogByIdDto) {
    await this.blogsService.deletePost(params.blogId, params.postId);
  }
}
