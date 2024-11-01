import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogsEntity } from '../domain/blogs.entity';
import { UpdateBlogDto } from '../api/dto/input/update-blog.dto';

@Injectable()
export class BlogsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async add(blog: BlogsEntity) {
    const [{ id }] = await this.dataSource.query(`
    INSERT INTO "Blogs" ("name", "description", "websiteUrl", "isMembership") 
    VALUES ('${blog.name}', '${blog.description}', '${blog.websiteUrl}', '${blog.isMembership}')
    RETURNING id
    `);

    return id;
  }

  async existsById(id: string) {
    const [{ exists }] = await this.dataSource.query(`
    SELECT EXISTS(SELECT * FROM "Blogs" WHERE id='${id}')
    `);
    return exists;
  }

  async update(blogId: string, dto: UpdateBlogDto): Promise<boolean> {
    const [, matchedCount] = await this.dataSource.query(
      `UPDATE "Blogs" 
             SET 
             "name" = '${dto.name}',
             "description" = '${dto.description}',
             "websiteUrl" = '${dto.websiteUrl}'
       WHERE id = '${blogId}'     
             `
    );

    return matchedCount === 1;
  }
  async remove(blogId: string) {
    const [, deleteResult] = await this.dataSource.query(`
   DELETE FROM "Blogs"
   WHERE id='${blogId}'`);

    return deleteResult === 1;
  }
}
