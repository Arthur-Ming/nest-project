import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/users/users.module';
import { appSettings } from './settings/app-settings';
import { AuthModule } from './features/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';

import { BlogPlatformModule } from './features/blog-platform/blog-platform.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: appSettings.api.RATE_LIMITING_TTL,
        limit: appSettings.api.RATE_LIMITING_LIMIT,
      },
    ]),
    MongooseModule.forRoot(
      appSettings.env.isTesting()
        ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
        : appSettings.api.MONGO_CONNECTION_URI
    ),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: appSettings.api.EMAIL,
          pass: appSettings.api.EMAIL_PASSWORD,
        },
      },
    }),
    TestingModule,
    AuthModule,
    BlogPlatformModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
