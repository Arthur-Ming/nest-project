import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { agent } from 'supertest';
import { AppModule } from './../src/app.module';
import { applyAppSettings } from '../src/settings/apply-app-setting';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app);
    await app.init();
  });

  it('/ (GET)', () => {
    return agent(app.getHttpServer()).get('/').expect(404);
  });
  afterAll(async () => {
    await app.close();
  });
});
