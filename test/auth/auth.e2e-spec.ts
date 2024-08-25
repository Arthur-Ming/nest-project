import { HttpStatus, INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { deleteCollections } from '../utils/delete-collections';
import { initSettings } from '../utils/init-settings';
import { AuthTestManager } from './utils/auth-test-manager';
import { UsersTestManager } from '../users/utils/users-test-manager';
import { createUserDtoMock } from '../users/mock-data/create-user.dto.mock';
import { expectValidationError } from '../utils/expect-validation-error';
import { correctBasicAuthCredentials } from '../users/constants/credentials';

describe('Auth e2e', () => {
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
        { ...createUserDtoMock, email: 'example1@example.com' },
        HttpStatus.BAD_REQUEST
      );
      expectValidationError(res.body, ['login']);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
