import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from '../api/dto/input/update-post.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsEntity } from '../domain/posts.entity';

@Injectable()
export class PostsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async add(post: PostsEntity) {
    const [{ id }] = await this.dataSource.query(`
    INSERT INTO "Posts" ("title", "shortDescription", "content", "blogId") 
    VALUES ('${post.title}', '${post.shortDescription}', '${post.content}', '${post.blogId}')
    RETURNING id
    `);

    return id;
  }

  async update(blogId: string, postId: string, dto: UpdatePostDto): Promise<boolean> {
    const [, matchedCount] = await this.dataSource.query(
      `UPDATE "Posts" 
             SET 
             "title" = '${dto.title}',
             "shortDescription" = '${dto.shortDescription}',
             "content" = '${dto.content}'
            WHERE id = '${postId}' AND "blogId"='${blogId}'    
             `
    );

    return matchedCount === 1;
  }
  async remove(blogId: string, postIt: string) {
    const [, deleteResult] = await this.dataSource.query(`
   DELETE FROM "Posts"
   WHERE id='${postIt}' AND "blogId"='${blogId}'`);

    return deleteResult === 1;
  }
  async existsById(id: string) {
    const [{ exists }] = await this.dataSource.query(`
    SELECT EXISTS(SELECT * FROM "Posts" WHERE id='${id}')
    `);
    return exists;
  }

  async existsForSpecificBlog(blogId: string, postId: string) {
    const [{ exists }] = await this.dataSource.query(`
    SELECT EXISTS(SELECT * FROM "Posts" as p WHERE p.id='${postId}' AND p."blogId"='${blogId}')
    `);
    return exists;
  }
}
