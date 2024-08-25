import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateUserDto } from '../../../src/features/users/api/dto/input/create-user.dto';
import { UsersTestManager } from '../../users/utils/users-test-manager';
import request from 'supertest';
import { AuthRoutes } from '../../../src/features/auth/routes/auth-routes';

function buildRoute(...paths: string[]) {
  return `/${paths.join('/')}`;
}
export class AuthTestManager {
  usersTestManager: UsersTestManager;
  constructor(protected readonly app: INestApplication) {
    this.usersTestManager = new UsersTestManager(app);
  }

  async registerUser(dto: CreateUserDto, statusCode: number = HttpStatus.NO_CONTENT) {
    return await request(this.app.getHttpServer())
      .post(buildRoute(AuthRoutes.base, AuthRoutes.registration))
      .send(dto)
      .expect(statusCode);
  }
}
