import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepo } from '../infrastructure/comments.query-repo';
import { CommentByIdDto } from './dto/input/comment-by-id.dto';
import { UpdateCommentDto } from './dto/input/update-comment.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { ExtractAccessToken } from '../../../auth/decorators/extract-access-token';
import { DecodeJwtTokenPipe } from '../../../auth/pipes/decode-jwt-token.pipe';
import { AccessTokenPayloadDto } from '../../../auth/api/dto/output/access-token-payload.dto';
import { LikePostDto } from '../../posts/api/dto/input/like-post.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@SkipThrottle()
@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private commentsQueryRepo: CommentsQueryRepo
  ) {}

  @Get(':id')
  async getCommentById(
    @Param() params: CommentByIdDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto | null
  ) {
    const userId = payload ? payload.userId : null;
    return await this.commentsQueryRepo.findById(params.id, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCommentById(
    @Param() params: CommentByIdDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto,
    @Body() dto: UpdateCommentDto
  ) {
    const isOwnComment = await this.commentsService.isOwnComment(params.id, payload.userId);
    if (!isOwnComment) {
      throw new ForbiddenException();
    }
    return await this.commentsService.updateComment(params.id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async likePost(
    @Param() params: CommentByIdDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto,
    @Body() likePostDto: LikePostDto
  ) {
    await this.commentsService.likeComment(payload.userId, params.id, likePostDto.likeStatus);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(
    @Param() params: CommentByIdDto,
    @ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto
  ) {
    const isOwnComment = await this.commentsService.isOwnComment(params.id, payload.userId);
    if (!isOwnComment) {
      throw new ForbiddenException();
    }
    return await this.commentsService.deleteComment(params.id);
  }
}
