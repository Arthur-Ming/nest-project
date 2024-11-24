import { Injectable } from '@nestjs/common';
import { PostsLikesEntity } from '../domain/posts-likes.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsLikesRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async existsByPostIdAndAuthorId(postId: string, authorId: string) {
    const [{ exists }] = await this.dataSource.query(`
    SELECT EXISTS(SELECT * FROM "PostLikes" as pl WHERE pl."postId"='${postId}' AND pl."authorId"='${authorId}' )
    `);
    return exists;
  }

  async put(dto: PostsLikesEntity) {
    const isExists = await this.existsByPostIdAndAuthorId(dto.postId, dto.authorId);
    if (!isExists) {
      const query = `
    INSERT INTO "PostLikes" ("status", "authorId", "postId", "createdAt") 
    VALUES ('${dto.status}', '${dto.authorId}', '${dto.postId}', CURRENT_TIMESTAMP)
    RETURNING id
    `;
      await this.dataSource.query(query);

      return true;
    }
    const [, matchedCount] = await this.dataSource.query(
      `UPDATE "PostLikes"  as pl
             SET 
             "status" = '${dto.status}',
             "createdAt" = CURRENT_TIMESTAMP
             WHERE pl."postId"='${dto.postId}' AND pl."authorId"='${dto.authorId}'     
             `
    );

    return matchedCount === 1;
  }
}
