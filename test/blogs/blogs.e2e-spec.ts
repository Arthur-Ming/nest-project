import { HttpStatus, INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import TestAgent from 'supertest/lib/agent';
import { deleteCollections } from '../utils/delete-collections';
import { createBlogMockDto } from './mockData/create-blog.mock.dto';
import { updateBlogMockDto } from './mockData/update-blog.mock.dto';
import { createdBlogModel } from './models/created-blog.model';
import { entitiesNum } from '../posts/constants/entities-num';
import { wait } from '../utils/wait';
import { genDbId } from '../utils/gen-db-id';
import { QueryParamsDto } from '../../src/common/dto/query-params.dto';
import { mapToPaginationParams } from '../utils/map-to-pagination-params';
import { initSettings } from '../utils/init-settings';
import { BlogsTestManager } from './utils/blogs-test-manager';

describe('Blogs e2e', () => {
  let app: INestApplication;
  let req: TestAgent;
  let databaseConnection: Connection;
  let blogsTestManager: BlogsTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;
    databaseConnection = result.databaseConnection;
    req = result.req;
    blogsTestManager = new BlogsTestManager(app);
  });
  describe('Blogs e2e base CRUD', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });

    it('should get empty array', async () => {
      const res = await req.get('/blogs').expect(HttpStatus.OK);
      expect(res.body.items).toEqual([]);
    });

    it('should create entity with correct input data', async function () {
      const { body: createdBlog } = await blogsTestManager.createBlog(createBlogMockDto);
      expect(createdBlog).toMatchObject(createdBlogModel);
      expect.setState({
        createdBlog,
      });
    });
    it('shouldn`t create entity by incorrect input data', async function () {
      await blogsTestManager.createBlog(
        {
          name: 'bl',
          description: 'string',
          websiteUrl: 'https://www.youtube.com/',
        },
        HttpStatus.BAD_REQUEST
      );

      // await blogsTestManager.createBlog(
      //   {
      //     name: 'bl',
      //     description: 'string',
      //     websiteUrl: 'https://www.youtube.com/',
      //   },
      //   HttpStatus.BAD_REQUEST
      // );
    });
    it('should get entity by correct id', async function () {
      const { createdBlog } = expect.getState();
      const postRes = await req.get('/blogs' + '/' + createdBlog.id).expect(HttpStatus.OK);
      expect(postRes.body).toMatchObject(createdBlog);
    });
    it('shouldn`t get entity by incorrect id', async function () {
      const someId = genDbId();
      await req.get('/blogs' + '/' + someId).expect(HttpStatus.NOT_FOUND);
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

    it('should delete entity by correct id', async function () {
      const { createdBlog } = expect.getState();
      await req.delete('/blogs' + '/' + createdBlog.id).expect(HttpStatus.NO_CONTENT);
      await req.get('/blogs' + '/' + createdBlog.id).expect(HttpStatus.NOT_FOUND);
    });
  });
  describe('Blogs e2e get with pagination', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });
    it('should get entities with default pagination params', async function () {
      for (let i = 0; i < entitiesNum; i++) {
        await req
          .post('/blogs')
          .send({ ...createBlogMockDto, name: `${createBlogMockDto.name}${i + 1}` });
        await wait(1);
      }

      const { body: blogsWithPagination } = await req.get('/blogs').expect(HttpStatus.OK);
      expect(blogsWithPagination.items.length).toBe(entitiesNum);
      const defaultQueryParams = mapToPaginationParams(new QueryParamsDto(), entitiesNum);

      expect(blogsWithPagination.pagesCount).toBe(defaultQueryParams.pagesCount);
      expect(blogsWithPagination.page).toBe(defaultQueryParams.page);
      expect(blogsWithPagination.pageSize).toBe(defaultQueryParams.pageSize);
      expect(blogsWithPagination.totalCount).toBe(defaultQueryParams.totalCount);
    }, 20000);
  });

  afterAll(async () => {
    await app.close();
  });
});
