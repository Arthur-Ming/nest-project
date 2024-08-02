import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { agent } from 'supertest';
import { Connection } from 'mongoose';
import { BlogsModule } from '../../src/features/blogs/blogs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from '../../src/settings/app-settings';
import TestAgent from 'supertest/lib/agent';
import { TestingModule } from '../../src/features/testing/testing.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { deleteCollections } from '../utils/delete-collections';
import { createBlogMockDto } from './mockData/create-blog.mock.dto';
import { updateBlogMockDto } from './mockData/update-blog.mock.dto';
import { createdBlogModel } from './models/created-blog.model';
import { setPagQueryParams } from '../../src/utils/set-pag-query-params';
import { mapToPaginationParams } from '../utils/map-to-pagination-params';
import { entitiesNum } from '../posts/constants/entities-num';
import { wait } from '../utils/wait';

describe('Blogs', () => {
  let app: INestApplication;
  let req: TestAgent;
  let databaseConnection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        BlogsModule,
        TestingModule,
        MongooseModule.forRoot(appSettings.mongoUrl + '/' + appSettings.dbBloggerPlatform),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    req = agent(app.getHttpServer());
    databaseConnection = app.get<Connection>(getConnectionToken());
    await deleteCollections(databaseConnection);
  });

  it('should get empty array', async () => {
    const res = await req.get('/blogs').expect(HttpStatus.OK);
    expect(res.body.items).toEqual([]);
  });

  it('should create entity with correct input data', async function () {
    const res = await req.post('/blogs').send(createBlogMockDto).expect(HttpStatus.CREATED);
    expect(res.body).toMatchObject(createdBlogModel);
    expect.setState({
      createdBlog: res.body,
    });
  });
  it('should get entity by correct id', async function () {
    const { createdBlog } = expect.getState();
    const postRes = await req.get('/blogs' + '/' + createdBlog.id).expect(HttpStatus.OK);

    expect(postRes.body).toMatchObject(createdBlog);
  });
  it('should update entity with correct input data', async function () {
    const { createdBlog } = expect.getState();
    await req
      .put('/blogs' + '/' + createdBlog.id)
      .send(updateBlogMockDto)
      .expect(HttpStatus.NO_CONTENT);
    const postRes = await req.get('/blogs' + '/' + createdBlog.id);
    expect(postRes.body).toMatchObject({ ...createdBlog, ...updateBlogMockDto });
  });

  it('should delete entity by incorrect id', async function () {
    const { createdBlog } = expect.getState();

    await req.delete('/blogs' + '/' + createdBlog.id).expect(HttpStatus.NO_CONTENT);
    await req.get('/blogs' + '/' + createdBlog.id).expect(HttpStatus.NOT_FOUND);
  });

  it('should get entities with default pagination params', async function () {
    await deleteCollections(databaseConnection);

    for (let i = 0; i < entitiesNum; i++) {
      await req
        .post('/blogs')
        .send({ ...createBlogMockDto, name: `${createBlogMockDto.name}${i + 1}` });
      await wait(1);
    }

    const { body: blogsWithPagination } = await req.get('/blogs').expect(HttpStatus.OK);
    expect(blogsWithPagination.items.length).toBe(entitiesNum);
    const defaultQueryParams = mapToPaginationParams(setPagQueryParams({}), entitiesNum);

    expect(blogsWithPagination.pagesCount).toBe(defaultQueryParams.pagesCount);
    expect(blogsWithPagination.page).toBe(defaultQueryParams.page);
    expect(blogsWithPagination.pageSize).toBe(defaultQueryParams.pageSize);
    expect(blogsWithPagination.totalCount).toBe(defaultQueryParams.totalCount);
  }, 20000);

  afterAll(async () => {
    await app.close();
  });
});
