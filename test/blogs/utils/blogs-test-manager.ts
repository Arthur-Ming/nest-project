import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createdBlogModel } from '../models/created-blog.model';
import { CreateBlogDto } from '../../../src/features/blog-platform/blogs/api/dto/input/create-blog.dto';
import { UpdateBlogDto } from '../../../src/features/blog-platform/blogs/api/dto/input/update-blog.dto';

export class BlogsTestManager {
  constructor(protected readonly app: INestApplication) {}
  expectCorrectModel(responseModel: any, correctModel: any = createdBlogModel) {
    expect(responseModel).toMatchObject(correctModel);
  }

  async createBlog(dto: CreateBlogDto, statusCode: number = HttpStatus.CREATED) {
    return await request(this.app.getHttpServer()).post('/blogs').send(dto).expect(statusCode);
  }

  async updateBlog(dto: UpdateBlogDto, blogId: string, statusCode: number = HttpStatus.NO_CONTENT) {
    return await request(this.app.getHttpServer())
      .put('/blogs' + '/' + blogId)
      .send(dto)
      .expect(statusCode);
  }

  async mustBeEmpty() {
    const res = await request(this.app.getHttpServer()).get('/blogs').expect(HttpStatus.OK);
    expect(res.body.items).toEqual([]);
  }
  async getBlogById(id: string, statusCode: number = HttpStatus.OK) {
    return await request(this.app.getHttpServer())
      .get('/blogs' + '/' + id)
      .expect(statusCode);
  }

  async getBlogs(statusCode: number = HttpStatus.OK) {
    return await request(this.app.getHttpServer()).get('/blogs').expect(statusCode);
  }

  async deleteBlogById(id: string, statusCode: number = HttpStatus.NO_CONTENT) {
    return await request(this.app.getHttpServer())
      .delete('/blogs' + '/' + id)
      .expect(statusCode);
  }
}
