import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './features/blogs/blogs.module';
import appSettings from './settings/app-settings';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/users/users.module';
import { PostsModule } from './features/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forRoot(appSettings.mongoUrl + '/' + 'blogger_platform'),
    TestingModule,
    BlogsModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
