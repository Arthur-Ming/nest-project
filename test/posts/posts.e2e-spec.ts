import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { agent } from 'supertest';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import TestAgent from 'supertest/lib/agent';
import { deleteCollections } from '../utils/delete-collections';
import { createBlogMockDto } from '../blogs/mockData/create-blog.mock.dto';
import { addPostDtoCreator } from './dtoCreators/input/add-post.dto-creator';
import { postDtoCreator } from './dtoCreators/output/post.dto-creator';
import { updatePostDtoCreator } from './dtoCreators/input/update-post.dto-creator';
import { wait } from '../utils/wait';
import { entitiesNum } from './constants/entities-num';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-setting';

describe.skip('Posts e2e', () => {
  let app: INestApplication;
  let req: TestAgent;
  let databaseConnection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    applyAppSettings(app);
    await app.init();
    req = agent(app.getHttpServer());
    databaseConnection = app.get<Connection>(getConnectionToken());
  });
  describe('Posts e2e base CRUD', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });

    it('should get empty array', async () => {
      const res = await req.get('/posts').expect(HttpStatus.OK);
      expect(res.body.items).toEqual([]);
    });

    it('should create entity with correct input data', async function () {
      const { body: createdBlog } = await req
        .post('/blogs')
        .send({ ...createBlogMockDto, name: 'blog for post' });

      expect.setState({
        createdBlog: createdBlog,
      });
      const addPostDto = addPostDtoCreator(createdBlog.id);
      const { body: createdPost } = await req
        .post('/posts')
        .send(addPostDto)
        .expect(HttpStatus.CREATED);
      expect(createdPost).toMatchObject(postDtoCreator(addPostDto, createdBlog));

      expect.setState({
        createdPost: createdPost,
      });
    });
    it('should create entity for specified blog with correct input data', async function () {
      const { createdBlog } = expect.getState();
      const addPostDto = addPostDtoCreator();

      const { body: createdPost } = await req
        .post('/blogs' + '/' + createdBlog.id + '/' + 'posts')
        .send(addPostDto)
        .expect(HttpStatus.CREATED);
      expect(createdPost).toMatchObject(postDtoCreator(addPostDto, createdBlog));
    });
    it('should get entity by correct id', async function () {
      const { createdPost } = expect.getState();
      const { body: post } = await req.get('/posts' + '/' + createdPost.id).expect(HttpStatus.OK);

      expect(post).toMatchObject(createdPost);
    });

    it('should update entity with correct input data', async function () {
      const { createdPost, createdBlog } = expect.getState();
      const updatePostDto = updatePostDtoCreator(createdBlog.id);
      await req
        .put('/posts' + '/' + createdPost.id)
        .send(updatePostDto)
        .expect(HttpStatus.NO_CONTENT);

      const { body: updatedPost } = await req.get('/posts' + '/' + createdPost.id);
      expect(updatedPost).toMatchObject(postDtoCreator(updatePostDto, createdBlog));
    });

    it('should delete entity by correct id', async function () {
      const { createdPost } = expect.getState();

      await req.delete('/posts' + '/' + createdPost.id).expect(HttpStatus.NO_CONTENT);
      await req.get('/posts' + '/' + createdPost.id).expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('Posts e2e get with pagination', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });
    it('should get entities with default pagination params', async function () {
      const { createdBlog } = expect.getState();

      for (let i = 0; i < entitiesNum; i++) {
        const addPostDto = addPostDtoCreator(createdBlog.id);
        addPostDto.title = `${addPostDto.title}${i + 1}`;
        await req.post('/posts').send(addPostDto);
        await wait(1);
      }
      const { body: postsWithPagination } = await req.get('/posts').expect(HttpStatus.OK);

      expect(postsWithPagination.items.length).toBe(entitiesNum);
      // const defaultQueryParams = mapToPaginationParams(
      //   new PostsPaginationQueryParamsDto(),
      //   entitiesNum
      // );

      // expect(postsWithPagination.pagesCount).toBe(defaultQueryParams.pagesCount);
      // expect(postsWithPagination.page).toBe(defaultQueryParams.page);
      // expect(postsWithPagination.pageSize).toBe(defaultQueryParams.pageSize);
      // expect(postsWithPagination.totalCount).toBe(defaultQueryParams.totalCount);
    }, 20000);
  });
  afterAll(async () => {
    await app.close();
  });
});
