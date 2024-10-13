import { HttpStatus, INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { deleteCollections } from '../utils/delete-collections';
import { initSettings } from '../utils/init-settings';
import { AuthTestManager } from './utils/auth-test-manager';
import { UsersTestManager } from '../users/utils/users-test-manager';
import { createUserDtoMock } from '../users/mock-data/create-user.dto.mock';
import { expectValidationError } from '../utils/expect-validation-error';
import { correctBasicAuthCredentials } from '../users/constants/credentials';
import { entitiesNum } from '../posts/constants/entities-num';
import { appSettings } from '../../src/settings/app-settings';
import { wait } from '../utils/wait';

describe.skip('Auth e2e', () => {
  let app: INestApplication;
  let databaseConnection: Connection;
  let authTestManager: AuthTestManager;
  let usersTestManager: UsersTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;
    databaseConnection = result.databaseConnection;
    authTestManager = new AuthTestManager(app);
    usersTestManager = new UsersTestManager(app);
  });

  describe('Auth e2e user registration', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });
    it('should get empty array', async () => {
      await usersTestManager.mustBeEmpty();
    });
    it('shouldn`t register user by incorrect input data', async () => {
      const res = await authTestManager.registerUser(
        { ...createUserDtoMock, login: '' },
        HttpStatus.BAD_REQUEST
      );
      expectValidationError(res.body, ['login']);
      await usersTestManager.mustBeEmpty();
    });

    it('shouldn`t register user by incorrect input data', async () => {
      const res = await authTestManager.registerUser(
        { ...createUserDtoMock, login: '', password: '' },
        HttpStatus.BAD_REQUEST
      );
      expectValidationError(res.body, ['login', 'password']);
      await usersTestManager.mustBeEmpty();
    });
    it('should register user by correct input data', async () => {
      await authTestManager.registerUser(createUserDtoMock, HttpStatus.NO_CONTENT);
      const { body: usersWithPagination } = await usersTestManager.getUsers(
        correctBasicAuthCredentials
      );
      const user = usersWithPagination.items[0];
      usersTestManager.expectCorrectModel(user);
      expect.setState({ user });
    });
    it('shouldn`t register already exists user', async () => {
      const res = await authTestManager.registerUser(
        { ...createUserDtoMock, email: 'example1@example.com' },
        HttpStatus.BAD_REQUEST
      );
      expectValidationError(res.body, ['login']);
    });

    it('shouldn`t register already exists user', async () => {
      const res = await authTestManager.registerUser(
        { ...createUserDtoMock, login: 'aaaaaaa' },
        HttpStatus.BAD_REQUEST
      );
      expectValidationError(res.body, ['email']);
    });
  });
  describe.skip('Auth e2e user registration rate limiting', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });

    it('shouldn`t registration rate limiting', async () => {
      await wait(10);
      const firstRequest = 1;
      for (let i = firstRequest; i < entitiesNum; i++) {
        const expectedStatusCode =
          i > appSettings.api.RATE_LIMITING_LIMIT
            ? HttpStatus.TOO_MANY_REQUESTS
            : HttpStatus.NO_CONTENT;

        await authTestManager.registerUser(
          {
            ...createUserDtoMock,
            email: i + createUserDtoMock.email,
            login: i + createUserDtoMock.login,
          },
          expectedStatusCode
        );
      }
    }, 20000);
  });
  describe('Auth e2e user login', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });
    it('should get empty array', async () => {
      await usersTestManager.mustBeEmpty();
    });
    it('should register user by correct input data', async () => {
      await authTestManager.registerUser(createUserDtoMock, HttpStatus.NO_CONTENT);
      const { body: usersWithPagination } = await usersTestManager.getUsers(
        correctBasicAuthCredentials
      );
      const user = usersWithPagination.items[0];
      usersTestManager.expectCorrectModel(user);
      expect.setState({ user });
    });
    it('shouldn`t login non-exists user', async () => {
      await authTestManager.loginUser(
        {
          loginOrEmail: createUserDtoMock.login + 'some',
          password: createUserDtoMock.password,
        },
        HttpStatus.UNAUTHORIZED
      );
    });
    it('shouldn`t login non-exists user', async () => {
      await authTestManager.loginUser(
        {
          loginOrEmail: 'some' + createUserDtoMock.email,
          password: createUserDtoMock.password,
        },
        HttpStatus.UNAUTHORIZED
      );
    });
    it('shouldn`t login by incorrect password', async () => {
      await authTestManager.loginUser(
        {
          loginOrEmail: createUserDtoMock.email,
          password: createUserDtoMock.password + '1',
        },
        HttpStatus.UNAUTHORIZED
      );
    });
    it('should login user', async () => {
      const { body } = await authTestManager.loginUser(
        {
          loginOrEmail: createUserDtoMock.email,
          password: createUserDtoMock.password,
        },
        HttpStatus.OK
      );
      authTestManager.expectCorrectLoginModel(body);
      expect.setState({
        accessToken: body.accessToken,
      });
    });
    it('shouldn`t auth me by invalid token', async () => {
      await authTestManager.authMe('123', HttpStatus.UNAUTHORIZED);
    });
    it('should auth me by valid token', async () => {
      const { accessToken } = expect.getState();
      await authTestManager.authMe(accessToken, HttpStatus.OK);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
