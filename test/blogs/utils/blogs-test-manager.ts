import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createdBlogModel } from '../models/created-blog.model';
import { CreateBlogDto } from '../../../src/features/blog-platform/blogs/api/dto/input/create-blog.dto';
import { UpdateBlogDto } from '../../../src/features/blog-platform/blogs/api/dto/input/update-blog.dto';
import { BasicAuthCredentials } from '../../users/constants/credentials';

export class BlogsTestManager {
  constructor(protected readonly app: INestApplication) {}
  expectCorrectModel(responseModel: any, correctModel: any = createdBlogModel) {
    expect(responseModel).toMatchObject(correctModel);
  }

  async createBlog(
    dto: CreateBlogDto,
    auth: BasicAuthCredentials | Record<string, never>,
    statusCode: number = HttpStatus.CREATED
  ) {
    return await request(this.app.getHttpServer())
      .post('/sa/blogs')
      .auth(auth.login, auth.password)
      .send(dto)
      .expect(statusCode);
  }

  async updateBlog(
    dto: UpdateBlogDto,
    blogId: string,
    auth: BasicAuthCredentials | Record<string, never>,
    statusCode: number = HttpStatus.NO_CONTENT
  ) {
    return await request(this.app.getHttpServer())
      .put('/sa/blogs' + '/' + blogId)
      .auth(auth.login, auth.password)
      .send(dto)
      .expect(statusCode);
  }
  async deleteAll() {
    await request(this.app.getHttpServer())
      .delete('/testing/all-data')
      .expect(HttpStatus.NO_CONTENT);
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

  async deleteBlogById(
    id: string,
    auth: BasicAuthCredentials | Record<string, never>,
    statusCode: number = HttpStatus.NO_CONTENT
  ) {
    return await request(this.app.getHttpServer())
      .delete('/sa/blogs' + '/' + id)
      .auth(auth.login, auth.password)
      .expect(statusCode);
  }
}
