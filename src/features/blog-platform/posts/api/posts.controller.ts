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
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepo } from '../infrastructure/posts.query-repo';
import { UpdatePostDto } from './dto/input/update-post.dto';
import { CreatePostDto } from './dto/input/create-post.dto';
import { PostByIdDto } from './dto/input/post-by-id.dto';
import { PostsPaginationQueryParamsDto } from './dto/input/posts-pagination-query-params.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { LikePostDto } from './dto/input/like-post.dto';
import { ExtractAccessToken } from '../../../auth/decorators/extract-access-token';
import { DecodeJwtTokenPipe } from '../../../auth/pipes/decode-jwt-token.pipe';
import { AccessTokenPayloadDto } from '../../../auth/api/dto/output/access-token-payload.dto';
import { BasicAuthGuard } from '../../../../common/guards/basic-auth.guard';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CommentsQueryRepo } from '../../comments/infrastructure/comments.query-repo';
import { CommentsPaginationQueryParamsDto } from '../../comments/api/dto/input/comments-pagination-query-params.dto';
import { CreateCommentDto } from '../../comments/api/dto/input/create-comment.dto';

@SkipThrottle()
@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepo: PostsQueryRepo,
    private commentsQueryRepo: CommentsQueryRepo
  ) {}
  @Get()
  async getAll(
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto | null,
    @Query()
    queryParams: PostsPaginationQueryParamsDto
  ) {
    const userId = payload ? payload.userId : null;
    return await this.postsQueryRepo.findAll(queryParams, userId, null);
  }

  @Get(':id')
  async getBlogById(
    @Param() params: PostByIdDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto | null
  ) {
    const userId = payload ? payload.userId : null;
    return await this.postsQueryRepo.findById(params.id, userId);
  }

  @Get(':id/comments')
  async getCommentsForSpecificPost(
    @Param() params: PostByIdDto,
    @Query()
    queryParams: CommentsPaginationQueryParamsDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto | null
  ) {
    const userId = payload ? payload.userId : null;
    return await this.commentsQueryRepo.findAll(queryParams, params.id, userId);
  }
  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto
  ) {
    const userId = payload ? payload.userId : null;
    const { id } = await this.postsService.addPost(createPostDto);
    return await this.postsQueryRepo.findById(id, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @Param() params: PostByIdDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto,
    @Body() createCommentDto: CreateCommentDto
  ) {
    const { id } = await this.postsService.addComment(createCommentDto, payload.userId, params.id);
    const userId = payload ? payload.userId : null;
    return this.commentsQueryRepo.findById(id, userId);
  }
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param() params: PostByIdDto, @Body() updatePostDto: UpdatePostDto) {
    await this.postsService.updatePost(params.id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async likePost(
    @Param() params: PostByIdDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto,
    @Body() likePostDto: LikePostDto
  ) {
    await this.postsService.likePost(payload.userId, params.id, likePostDto.likeStatus);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param() params: PostByIdDto) {
    await this.postsService.deletePost(params.id);
  }
}
