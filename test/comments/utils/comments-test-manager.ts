import { INestApplication } from '@nestjs/common';

export class CommentsTestManager {
  constructor(protected readonly app: INestApplication) {}
}
