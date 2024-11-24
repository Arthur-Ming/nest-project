import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentLikesEntity } from '../../domain/pg/comment-likes.entity';

@Injectable()
export class CommentsLikesRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async existsByCommentIdAndAuthorId(commentId: string, authorId: string) {
    const [{ exists }] = await this.dataSource.query(`
    SELECT EXISTS(SELECT * FROM "CommentLikes" as pl WHERE pl."commentId"='${commentId}' AND pl."authorId"='${authorId}' )
    `);
    return exists;
  }

  async put(dto: CommentLikesEntity) {
    const isExists = await this.existsByCommentIdAndAuthorId(dto.commentId, dto.authorId);
    if (!isExists) {
      const query = `
    INSERT INTO "CommentLikes" ("status", "authorId", "commentId", "createdAt") 
    VALUES ('${dto.status}', '${dto.authorId}', '${dto.commentId}', CURRENT_TIMESTAMP)
    RETURNING id
    `;
      await this.dataSource.query(query);

      return true;
    }
    const [, matchedCount] = await this.dataSource.query(
      `UPDATE "CommentLikes"  as cl
             SET 
             "status" = '${dto.status}',
             "createdAt" = CURRENT_TIMESTAMP
             WHERE cl."commentId"='${dto.commentId}' AND cl."authorId"='${dto.authorId}'     
             `
    );

    return matchedCount === 1;
  }
}
