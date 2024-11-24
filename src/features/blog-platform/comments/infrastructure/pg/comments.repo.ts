import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentsEntity } from '../../domain/pg/comments.entity';
import { UpdateCommentDto } from '../../api/dto/input/update-comment.dto';

@Injectable()
export class CommentsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async add(comment: CommentsEntity) {
    const query = `
     INSERT INTO "Comments" ("content", "userId", "postId") 
    VALUES ('${comment.content}', '${comment.userId}', '${comment.postId}')
    RETURNING id
    `;
    const [{ id }] = await this.dataSource.query(query);
    return id;
  }

  async update(commentId: string, dto: UpdateCommentDto): Promise<boolean> {
    const [, matchedCount] = await this.dataSource.query(
      `UPDATE "Comments" 
             SET 
             "content" = '${dto.content}'
             WHERE id = '${commentId}'    
             `
    );

    return matchedCount === 1;
  }

  async removeById(id: string) {
    const [, deleteResult] = await this.dataSource.query(`
   DELETE FROM "Comments"
   WHERE id='${id}'`);

    return deleteResult === 1;
  }

  async getById(id: string) {
    const [comment] = await this.dataSource.query(`
  SELECT c.* FROM "Comments" as c
  WHERE c.id='${id}'`);
    if (!comment) return null;

    return comment;
  }

  async existsById(id: string) {
    const [{ exists }] = await this.dataSource.query(`
    SELECT EXISTS(SELECT * FROM "Comments" WHERE id='${id}')
    `);
    return exists;
  }
}
