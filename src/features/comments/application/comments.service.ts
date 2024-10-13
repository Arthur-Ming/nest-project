import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from '../api/dto/input/create-comment.dto';
import { CommentsRepo } from '../infrastructure/comments.repo';
import { ObjectId } from 'mongodb';
import { UpdateCommentDto } from '../api/dto/input/update-comment.dto';
import { LikesStatusEnum } from '../../../common/enum/likes-status.enum';
import { CommentLikesRepo } from '../infrastructure/comment-likes.repo';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepo: CommentsRepo,
    private readonly commentLikesRepo: CommentLikesRepo
  ) {}
  async createComment(dto: CreateCommentDto, userId: string, postId: string) {
    const commentId = await this.commentsRepo.add({
      content: dto.content,
      createdAt: Date.now(),
      postId: new ObjectId(postId),
      userId: new ObjectId(userId),
    });
    return { id: commentId };
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto) {
    return await this.commentsRepo.update(id, updateCommentDto);
  }

  async deleteComment(id: string) {
    return await this.commentsRepo.removeById(id);
  }
  async likeComment(authorId: string, commentId: string, status: LikesStatusEnum) {
    await this.commentLikesRepo.put({
      createdAt: Date.now(),
      authorId: new ObjectId(authorId),
      commentId: new ObjectId(commentId),
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
