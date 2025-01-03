import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { agent } from 'supertest';
import { Connection } from 'mongoose';
import TestAgent from 'supertest/lib/agent';
import { deleteCollections } from '../utils/delete-collections';
import { createBlogMockDto } from '../blogs/mockData/create-blog.mock.dto';
import { addPostDtoCreator } from './dtoCreators/input/add-post.dto-creator';
import { wait } from '../utils/wait';
import { entitiesNum } from './constants/entities-num';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-setting';
import { aDescribe } from '../utils/aDescribe';
import { PostsTestNamesEnum } from './constants/posts-test-names.enum';
import { ExpectedPostDto } from './dto/output/expected-post.dto';
import { CreatePostForSpecifiedBlogDto } from './dto/input/create-post-for-specified-blog.dto';
import { BlogsTestManager } from '../blogs/utils/blogs-test-manager';
import { PostsTestManager } from './utils/posts-test-manager';
import { UpdatePostDto } from './dto/input/update-post.dto';
import { correctBasicAuthCredentials } from '../users/constants/credentials';

aDescribe(PostsTestNamesEnum.postsAll)('Posts e2e', () => {
  let app: INestApplication;
  let req: TestAgent;
  let databaseConnection: Connection;
  let postsTestManager: PostsTestManager;
  let blogsTestManager: BlogsTestManager;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    applyAppSettings(app);
    await app.init();
    req = agent(app.getHttpServer());

    postsTestManager = new PostsTestManager(app);
    blogsTestManager = new BlogsTestManager(app);
  });
  aDescribe(PostsTestNamesEnum.postsCreating)('Posts e2e creating', () => {
    beforeAll(async () => {
      //  await deleteCollections(databaseConnection);
    });

    it('should get empty array', async () => {
      const res = await req.get('/posts').expect(HttpStatus.OK);
      expect(res.body.items).toEqual([]);
    });

    it('should create entity with correct input data', async function () {
      const { body: createdBlog } = await blogsTestManager.createBlog(
        createBlogMockDto,
        correctBasicAuthCredentials
      );

      const createPostDto = new CreatePostForSpecifiedBlogDto(createdBlog.id);

      const expectedPostDto = new ExpectedPostDto(createPostDto, createdBlog);

      const { body: createdPost } = await postsTestManager.createPost(createPostDto);

      postsTestManager.expectCorrectModel(createdPost, expectedPostDto);

      expect.setState({
        createdBlog: createdBlog,
        createdPost: createdPost,
      });
    });
    it('should create entity for specified blog with correct input data', async function () {
      const { createdBlog } = expect.getState();
      const createPostForSpecifiedBlogDto = new CreatePostForSpecifiedBlogDto(createdBlog.id);

      const { body: createdPostForSpecifiedBlo } = await postsTestManager.createPostForSpecificBlog(
        createPostForSpecifiedBlogDto
      );
      const expectedPostDto = new ExpectedPostDto(createPostForSpecifiedBlogDto, createdBlog);
      postsTestManager.expectCorrectModel(createdPostForSpecifiedBlo, expectedPostDto);
    });
    it('should get entity by correct id', async function () {
      const { createdPost } = expect.getState();
      const { body: post } = await postsTestManager.getPostById(createdPost.id); //req.get('/posts' + '/' + createdPost.id).expect(HttpStatus.OK);
      postsTestManager.expectCorrectModel(post, createdPost);
    });

    it('should update entity with correct input data', async function () {
      const { createdPost, createdBlog } = expect.getState();

      const updatePostDto = new UpdatePostDto(createdBlog.id, { ...createdPost, title: 'updated' });
      const { body: updatedPost } = await postsTestManager.updatePost(
        updatePostDto,
        createdPost.id
      );

      postsTestManager.expectCorrectModel(updatePostDto, updatedPost);
    });

    it('should delete entity by correct id', async function () {
      const { createdPost } = expect.getState();
      await postsTestManager.deletePostById(createdPost.id);
      await postsTestManager.getPostById(createdPost.id, HttpStatus.NOT_FOUND);
    });
  });

  aDescribe(PostsTestNamesEnum.postsPagination)('Posts e2e get with pagination', () => {
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
