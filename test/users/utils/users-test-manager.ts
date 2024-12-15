import { HttpStatus, INestApplication } from '@nestjs/common';
import request, { agent } from 'supertest';
import { CreateUserDto } from '../../../src/features/users/api/dto/input/create-user.dto';
import { newUserModel } from '../models/new-user.model';
import { BasicAuthCredentials, correctBasicAuthCredentials } from '../constants/credentials';

export class UsersTestManager {
  private req: InstanceType<typeof agent>;
  constructor(protected readonly app: INestApplication) {
    this.req = request(this.app.getHttpServer()); //agent(app.getHttpServer());
  }
  expectCorrectModel(responseModel: any, correctModel: any = newUserModel) {
    expect(responseModel).toMatchObject(correctModel);
  }

  async mustBeEmpty() {
    const { login, password } = correctBasicAuthCredentials;

    const res = await this.req.get('/sa/users').auth(login, password).expect(HttpStatus.OK);

    expect(res.body.items).toEqual([]);
  }
  async createUser(
    dto: CreateUserDto,
    auth: BasicAuthCredentials | Record<string, never>,
    statusCode: number = HttpStatus.CREATED
  ) {
    return await this.req
      .post('/sa/users')
      .auth(auth.login, auth.password)
      .send(dto)
      .expect(statusCode);
  }
  async deleteUser(
    id: string,
    auth: BasicAuthCredentials | Record<string, never>,
    statusCode: number = HttpStatus.NO_CONTENT
  ) {
    return await request(this.app.getHttpServer())
      .delete('/sa/users' + '/' + id)
      .auth(auth.login, auth.password)
      .expect(statusCode);
  }

  async getUsers(
    auth: BasicAuthCredentials | Record<string, never>,
    statusCode: number = HttpStatus.OK
  ) {
    return await request(this.app.getHttpServer())
      .get('/sa/users')
      .auth(auth.login, auth.password)
      .expect(statusCode);
  }
}
