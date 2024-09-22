import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreatePostDto } from '../dto/input/create-post.dto';

export class PostsTestManager {
  constructor(protected readonly app: INestApplication) {}

  expectCorrectModel(responseModel: any, correctModel: any) {
    expect(responseModel).toMatchObject(correctModel);
  }

  async createPost(dto: CreatePostDto, statusCode: number = HttpStatus.CREATED) {
    return await request(this.app.getHttpServer()).post('/posts').send(dto).expect(statusCode);
  }
}
