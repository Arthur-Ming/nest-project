import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreatePostDto } from '../dto/input/create-post.dto';
import { CreatePostForSpecifiedBlogDto } from '../dto/input/create-post-for-specified-blog.dto';
import { UpdatePostDto } from '../dto/input/update-post.dto';

export class PostsTestManager {
  constructor(protected readonly app: INestApplication) {}

  expectCorrectModel(responseModel: any, correctModel: any) {
    expect(responseModel).toMatchObject(correctModel);
  }

  async createPost(dto: CreatePostDto, statusCode: number = HttpStatus.CREATED) {
    return await request(this.app.getHttpServer()).post('/posts').send(dto).expect(statusCode);
  }
  async createPostForSpecificBlog(
    dto: CreatePostForSpecifiedBlogDto,
    statusCode: number = HttpStatus.CREATED
  ) {
    return await request(this.app.getHttpServer())
      .post('/blogs' + '/' + dto.blogId + '/' + 'posts')
      .send(dto)
      .expect(statusCode);
  }
  async updatePost(dto: UpdatePostDto, postId: string, statusCode: number = HttpStatus.NO_CONTENT) {
    return await request(this.app.getHttpServer())
      .put('/posts' + '/' + postId)
      .send(dto)
      .expect(statusCode);
  }
  async getPostById(id: string, statusCode: number = HttpStatus.OK) {
    return await request(this.app.getHttpServer())
      .get('/posts' + '/' + id)
      .expect(statusCode);
  }

  async deletePostById(id: string, statusCode: number = HttpStatus.NO_CONTENT) {
    return await request(this.app.getHttpServer())
      .delete('/posts' + '/' + id)
      .expect(statusCode);
  }
}
