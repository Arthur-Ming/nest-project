import { Module } from '@nestjs/common';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/users/users.module';
import { appSettings } from './settings/app-settings';
import { AuthModule } from './features/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { BlogPlatformModule } from './features/blog-platform/blog-platform.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: appSettings.api.RATE_LIMITING_TTL,
        limit: appSettings.api.RATE_LIMITING_LIMIT,
      },
    ]),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'art',
      username: 'art',
      // entities: [User, EmailConfirmation],
      database: appSettings.env.isTesting() ? 'BloggersPlatform' : 'BloggersPlatform',
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
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
