import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { deleteCollections } from '../utils/delete-collections';
import { initSettings } from '../utils/init-settings';

describe.skip('Comments e2e', () => {
  let app: INestApplication;
  let databaseConnection: Connection;
  // let commentsTestManager: CommentsTestManager;

  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;
    databaseConnection = result.databaseConnection;
    // commentsTestManager = new CommentsTestManager(app);
  });

  describe('Users e2e users creating', () => {
    beforeAll(async () => {
      await deleteCollections(databaseConnection);
    });
    it('should get empty array', async () => {});
    it('should create entity with correct input data', async function () {});
  });

  afterAll(async () => {
    await app.close();
  });
});
