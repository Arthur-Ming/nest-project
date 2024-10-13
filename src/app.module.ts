import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './features/blogs/blogs.module';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/users/users.module';
import { PostsModule } from './features/posts/posts.module';
import { appSettings } from './settings/app-settings';
import { AuthModule } from './features/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { CommentsModule } from './features/comments/comments.module';

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
    BlogsModule,
    UsersModule,
    PostsModule,
    CommentsModule,
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
