import { HttpStatus, INestApplication } from '@nestjs/common';
import { initSettings } from '../utils/init-settings';
import { UsersTestManager } from './utils/users-test-manager';
import { createUserDtoMock } from './mock-data/create-user.dto.mock';
import {
  correctBasicAuthCredentials,
  inCorrectBasicAuthCredentials,
} from './constants/credentials';
import { genDbId } from '../utils/gen-db-id';
import { expectValidationError } from '../utils/expect-validation-error';
import { entitiesNum } from '../posts/constants/entities-num';
import { wait } from '../utils/wait';
import { PaginationTestManager } from '../utils/pagination-test-manager';
import { UsersPaginationQueryParamsDto } from '../../src/features/users/api/dto/input/users-pagination-query-params.dto';

describe('Users e2e', () => {
  let app: INestApplication;

  let usersTestManager: UsersTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;
    usersTestManager = new UsersTestManager(app);
  });

  describe.skip('Users e2e users creating', () => {
    // beforeAll(async () => {
    //   await deleteCollections(databaseConnection);
    // });
    it('should get empty array', async () => {
      await usersTestManager.mustBeEmpty();
    });
    it('should not create entity for unauthorized  user', async () => {
      await usersTestManager.createUser(
        createUserDtoMock,
        inCorrectBasicAuthCredentials,
        HttpStatus.UNAUTHORIZED
      );
      await usersTestManager.mustBeEmpty();
    });

    it('should not create entity for unauthorized  user', async () => {
      await usersTestManager.createUser(createUserDtoMock, {}, HttpStatus.UNAUTHORIZED);
      await usersTestManager.mustBeEmpty();
    });
    it('should not create entity by incorrect input data', async () => {
      const res = await usersTestManager.createUser(
        { ...createUserDtoMock, login: '' },
        correctBasicAuthCredentials,
        HttpStatus.BAD_REQUEST
      );

      expectValidationError(res.body, ['login']);
      await usersTestManager.mustBeEmpty();
    });
    it('should create entity for authorized user', async () => {
      const { body: createdUser } = await usersTestManager.createUser(
        createUserDtoMock,
        correctBasicAuthCredentials,
        HttpStatus.CREATED
      );
      usersTestManager.expectCorrectModel(createdUser);
    });
  });
  describe('Users e2e users deleting', () => {
    beforeAll(async () => {
      //  await deleteCollections(databaseConnection);
    });
    it('should get empty array', async () => {
      // await usersTestManager.mustBeEmpty();
    });
    it('should create entity for authorized user', async () => {
      const { body: createdUser } = await usersTestManager.createUser(
        createUserDtoMock,
        correctBasicAuthCredentials,
        HttpStatus.CREATED
      );
      usersTestManager.expectCorrectModel(createdUser);
      expect.setState({ createdUser });
    });

    it('shouldn`t delete for unauthorized  user', async () => {
      const { createdUser } = expect.getState();
      await usersTestManager.deleteUser(
        createdUser.id,
        inCorrectBasicAuthCredentials,
        HttpStatus.UNAUTHORIZED
      );
      usersTestManager.expectCorrectModel(createdUser);
      expect.setState({ createdUser });
    });

    it('shouldn`t delete a non-existent entity', async () => {
      const someId = genDbId();
      await usersTestManager.deleteUser(someId, correctBasicAuthCredentials, HttpStatus.NOT_FOUND);
    });

    it.skip('shouldn`t delete by incorrect id', async () => {
      const incorrectId = '123';
      await usersTestManager.deleteUser(
        incorrectId,
        correctBasicAuthCredentials,
        HttpStatus.NOT_FOUND
      );
    });
    it('should delete entity by correct id', async () => {
      const { createdUser } = expect.getState();
      await usersTestManager.deleteUser(
        createdUser.id,
        correctBasicAuthCredentials,
        HttpStatus.NO_CONTENT
      );
      await usersTestManager.mustBeEmpty();
    });
  });
  describe.skip('Users e2e users reading with pagination', () => {
    beforeAll(async () => {
      //await deleteCollections(databaseConnection);
    });
    it('should get empty array', async () => {
      await usersTestManager.mustBeEmpty();
    });
    it('should get entities for unauthorized  user', async () => {
      for (let i = 0; i < entitiesNum; i++) {
        await usersTestManager.createUser(
          {
            ...createUserDtoMock,
            login: `${createUserDtoMock.login}${i + 1}`,
          },
          correctBasicAuthCredentials,
          HttpStatus.CREATED
        );
        await wait(1);
      }
      await usersTestManager.getUsers(inCorrectBasicAuthCredentials, HttpStatus.UNAUTHORIZED);
    }, 20000);
    it('should get entities for authorized  user', async () => {
      await usersTestManager.getUsers(correctBasicAuthCredentials, HttpStatus.OK);
    });
    it('should get entities with default pagination params', async () => {
      const { body: usersWithPagination } = await usersTestManager.getUsers(
        correctBasicAuthCredentials,
        HttpStatus.OK
      );
      const paginationTestManager = new PaginationTestManager();
      paginationTestManager.expectPaginationParams(
        usersWithPagination,
        new UsersPaginationQueryParamsDto(),
        entitiesNum
      );
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
