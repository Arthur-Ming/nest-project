import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, Post } from './domain/posts.entity';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { PostsQueryRepo } from './infrastructure/posts.query-repo';
import { PostsRepo } from './infrastructure/posts.repo';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [PostsController],
  providers: [PostsService, PostsRepo, PostsQueryRepo],
})
export class PostsModule {}
