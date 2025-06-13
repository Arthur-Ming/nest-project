import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentLike } from '../../domain/pg/comment-likes.entity';
import { LikesStatusEnum } from '../../../../../common/enum/likes-status.enum';

@Injectable()
export class CommentsLikesRepo {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(CommentLike) private commentsLikesRepository: Repository<CommentLike>
  ) {}

  async existsByCommentIdAndAuthorId(commentId: string, authorId: string) {
    return await this.commentsLikesRepository.existsBy({
      commentId,
      authorId,
    });
  }

  async put(authorId: string, commentId: string, status: LikesStatusEnum) {
    const isExists = await this.existsByCommentIdAndAuthorId(commentId, authorId);
    if (!isExists) {
      const p = await this.commentsLikesRepository.save({
        status,
        authorId,
        commentId,
      });

      return p.id;
    }

    const updateResult = await this.commentsLikesRepository.update(
      { commentId, authorId },
      {
        status,
        createdAt: () => 'CURRENT_TIMESTAMP',
      }
    );
    return updateResult.affected === 1;
  }
}
