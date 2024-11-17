import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from '../api/dto/input/create-comment.dto';
import { CommentsRepo } from '../infrastructure/pg/comments.repo';
import { CommentsLikesRepo } from '../infrastructure/pg/comments-likes.repo';
import { UpdateCommentDto } from '../api/dto/input/update-comment.dto';
import { LikesStatusEnum } from '../../../../common/enum/likes-status.enum';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepo: CommentsRepo,
    private readonly commentLikesRepo: CommentsLikesRepo
  ) {}
  async createComment(dto: CreateCommentDto, userId: string, postId: string) {
    const commentId = await this.commentsRepo.add({
      content: dto.content,
      postId: postId,
      userId: userId,
    });
    return commentId;
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto) {
    return await this.commentsRepo.update(id, updateCommentDto);
  }

  async deleteComment(id: string) {
    return await this.commentsRepo.removeById(id);
  }
  async likeComment(authorId: string, commentId: string, status: LikesStatusEnum) {
    await this.commentLikesRepo.put({
      authorId,
      commentId,
      status,
    });
  }

  async isOwnComment(commentId: string, userId: string) {
    const comment = await this.commentsRepo.getById(commentId);
    if (!comment) {
      return false;
    }
    return comment.userId.toString() === userId;
  }
}
