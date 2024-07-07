import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs.entity';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsQueryRepo } from './infrastructure/blogs.query-repo';
import { BlogsRepo } from './infrastructure/blogs.repo';
import { PostsService } from '../posts/application/posts.service';
import { PostsRepo } from '../posts/infrastructure/posts.repo';
import { Post, PostSchema } from '../posts/domain/posts.entity';
import { PostsQueryRepo } from '../posts/infrastructure/posts.query-repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsQueryRepo, BlogsRepo, PostsService, PostsRepo, PostsQueryRepo],
})
export class BlogsModule {}
