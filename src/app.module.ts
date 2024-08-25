import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './features/blogs/blogs.module';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/users/users.module';
import { PostsModule } from './features/posts/posts.module';
import { appSettings } from './settings/app-settings';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      appSettings.env.isTesting()
        ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
        : appSettings.api.MONGO_CONNECTION_URI
    ),
    TestingModule,
    AuthModule,
    BlogsModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
