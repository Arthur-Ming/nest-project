import { HttpStatus, INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { deleteCollections } from '../utils/delete-collections';
import { createBlogMockDto } from './mockData/create-blog.mock.dto';
import { updateBlogMockDto } from './mockData/update-blog.mock.dto';
import { entitiesNum } from '../posts/constants/entities-num';
import { wait } from '../utils/wait';
import { genDbId } from '../utils/gen-db-id';
import { initSettings } from '../utils/init-settings';
import { BlogsTestManager } from './utils/blogs-test-manager';
import { expectValidationError } from '../utils/expect-validation-error';
import { PaginationTestManager } from '../utils/pagination-test-manager';
import { BlogsPaginationQueryParamsDto } from '../../src/features/blogs/api/dto/input/blogs-pagination-query-params.dto';
import { aDescribe } from '../utils/aDescribe';
import { BlogTestNamesEnum } from './constants/blog-test-names.enum';

aDescribe(BlogTestNamesEnum.blogsAll)('Blogs e2e', () => {
  let app: INestApplication;
  let databaseConnection: Connection;
  let blogsTestManager: BlogsTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;
    databaseConnection = result.databaseConnection;

    blogsTestManager = new BlogsTestManager(app);
  });

  aDescribe(BlogTestNamesEnum.blogsCreating)('Blogs e2e blogs creating', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });
    it('should get empty array', async () => {
      await blogsTestManager.mustBeEmpty();
    });
    it('shouldn`t create entity by incorrect input data', async function () {
      const res = await blogsTestManager.createBlog({} as any, HttpStatus.BAD_REQUEST);
      expectValidationError(res.body, ['name', 'description', 'websiteUrl']);
      await blogsTestManager.mustBeEmpty();
    });
    it('shouldn`t create entity by incorrect input data', async function () {
      const res = await blogsTestManager.createBlog(
        { ...createBlogMockDto, name: 'f' } as any,
        HttpStatus.BAD_REQUEST
      );
      expectValidationError(res.body, ['name']);
      await blogsTestManager.mustBeEmpty();
    });

    it('shouldn`t create entity by incorrect input data', async function () {
      const res = await blogsTestManager.createBlog(
        { ...createBlogMockDto, description: 'f' } as any,
        HttpStatus.BAD_REQUEST
      );
      expectValidationError(res.body, ['description']);
      await blogsTestManager.mustBeEmpty();
    });

    it('shouldn`t create entity by incorrect input data', async function () {
      const res = await blogsTestManager.createBlog(
        { ...createBlogMockDto, websiteUrl: 'f' } as any,
        HttpStatus.BAD_REQUEST
      );
      expectValidationError(res.body, ['websiteUrl']);
      await blogsTestManager.mustBeEmpty();
    });

    it('should create entity with correct input data', async function () {
      const { body: createdBlog } = await blogsTestManager.createBlog(createBlogMockDto);
      blogsTestManager.expectCorrectModel(createdBlog);
      const { body: resBody } = await blogsTestManager.getBlogById(createdBlog.id);
      blogsTestManager.expectCorrectModel(resBody);
    });
  });
  aDescribe(BlogTestNamesEnum.blogsReading)('Blogs e2e blogs reading', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });
    it('should get empty array', async () => {
      await blogsTestManager.mustBeEmpty();
    });
    it('should create entity with correct input data', async function () {
      const { body: createdBlog } = await blogsTestManager.createBlog(createBlogMockDto);
      blogsTestManager.expectCorrectModel(createdBlog);
      expect.setState({ createdBlog });
    });
    it('should get entity by correct id', async function () {
      const { createdBlog } = expect.getState();
      const { body: resBody } = await blogsTestManager.getBlogById(createdBlog.id);
      blogsTestManager.expectCorrectModel(resBody);
    });
    it('shouldn`t get entity by incorrect id', async function () {
      await blogsTestManager.getBlogById('123', HttpStatus.NOT_FOUND);
    });
    it('shouldn`t get a non-existent entity', async function () {
      const someId = genDbId();
      await blogsTestManager.getBlogById(someId, HttpStatus.NOT_FOUND);
    });
  });
  aDescribe(BlogTestNamesEnum.blogsUpdating)('Blogs e2e blogs updating', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });
    it('should get empty array', async () => {
      await blogsTestManager.mustBeEmpty();
    });
    it('should create entity with correct input data', async function () {
      const { body: createdBlog } = await blogsTestManager.createBlog(createBlogMockDto);
      blogsTestManager.expectCorrectModel(createdBlog);
      expect.setState({ createdBlog });
    });
    it('shouldn`t update entity by incorrect id', async function () {
      await blogsTestManager.updateBlog(updateBlogMockDto, '123', HttpStatus.NOT_FOUND);
    });
    it('shouldn`t update a non-existent entity', async function () {
      const someId = genDbId();
      await blogsTestManager.updateBlog(updateBlogMockDto, someId, HttpStatus.NOT_FOUND);
    });
    it('shouldn`t update entity with incorrect input data', async function () {
      const { createdBlog } = expect.getState();
      const res = await blogsTestManager.updateBlog(
        {} as any,
        createdBlog.id,
        HttpStatus.BAD_REQUEST
      );
      expectValidationError(res.body, ['name', 'description', 'websiteUrl']);
      const { body: blog } = await blogsTestManager.getBlogById(createdBlog.id);
      blogsTestManager.expectCorrectModel(blog, createdBlog);
    });
    it('shouldn`t update entity with incorrect input data', async function () {
      const { createdBlog } = expect.getState();
      const res = await blogsTestManager.updateBlog(
        { ...updateBlogMockDto, name: 'f' } as any,
        createdBlog.id,
        HttpStatus.BAD_REQUEST
      );
      expectValidationError(res.body, ['name']);
      const { body: blog } = await blogsTestManager.getBlogById(createdBlog.id);
      blogsTestManager.expectCorrectModel(blog, createdBlog);
    });
    it('should update entity with correct input data', async function () {
      const { createdBlog } = expect.getState();
      await blogsTestManager.updateBlog(updateBlogMockDto, createdBlog.id);
      const { body: updatedBlog } = await blogsTestManager.getBlogById(createdBlog.id);
      blogsTestManager.expectCorrectModel(updatedBlog, {
        ...createdBlog,
        ...updateBlogMockDto,
      });
    });
  });
  aDescribe(BlogTestNamesEnum.blogsDeleting)('Blogs e2e blogs deleting', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });
    it('should get empty array', async () => {
      await blogsTestManager.mustBeEmpty();
    });
    it('should create entity with correct input data', async function () {
      const { body: createdBlog } = await blogsTestManager.createBlog(createBlogMockDto);
      blogsTestManager.expectCorrectModel(createdBlog);
      expect.setState({ createdBlog });
    });
    it('shouldn`t delete a non-existent entity', async function () {
      const someId = genDbId();
      await blogsTestManager.deleteBlogById(someId, HttpStatus.NOT_FOUND);
    });
    it('shouldn`t delete entity by incorrect id', async function () {
      await blogsTestManager.deleteBlogById('123', HttpStatus.NOT_FOUND);
    });
    it('should delete entity by correct id', async function () {
      const { createdBlog } = expect.getState();
      await blogsTestManager.deleteBlogById(createdBlog.id);
      await blogsTestManager.getBlogById(createdBlog.id, HttpStatus.NOT_FOUND);
    });
  });
  aDescribe(BlogTestNamesEnum.blogsPagination)('Blogs e2e get with pagination', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });
    it('should get entities with default pagination params', async function () {
      for (let i = 0; i < entitiesNum; i++) {
        await blogsTestManager.createBlog({
          ...createBlogMockDto,
          name: `${createBlogMockDto.name}${i + 1}`,
        });
        await wait(1);
      }
      const { body: blogsWithPagination } = await blogsTestManager.getBlogs();
      const paginationTestManager = new PaginationTestManager();
      paginationTestManager.expectPaginationParams(
        blogsWithPagination,
        new BlogsPaginationQueryParamsDto(),
        entitiesNum
      );

      // expect(blogsWithPagination.items.length).toBe(entitiesNum);
      // const defaultQueryParams = mapToPaginationParams(new QueryParamsDto(), entitiesNum);

      // expect(blogsWithPagination.pagesCount).toBe(defaultQueryParams.pagesCount);
      // expect(blogsWithPagination.page).toBe(defaultQueryParams.page);
      // expect(blogsWithPagination.pageSize).toBe(defaultQueryParams.pageSize);
      // expect(blogsWithPagination.totalCount).toBe(defaultQueryParams.totalCount);
    }, 20000);
  });

  afterAll(async () => {
    await app.close();
  });
});
