import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/posts.entity';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { PostsQueryRepo } from './infrastructure/posts.query-repo';
import { PostsRepo } from './infrastructure/posts.repo';
import { IsPostExistConstraint } from './decorators/validate/is-post-exist';
import { CommentsModule } from '../comments/comments.module';
import { AuthModule } from '../auth/auth.module';
import { PostLikes, PostLikesSchema } from './domain/posts-likes.entity';
import { PostsLikesRepo } from './infrastructure/posts-likes.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: PostLikes.name, schema: PostLikesSchema }]),
    CommentsModule,
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepo, PostsQueryRepo, PostsLikesRepo, IsPostExistConstraint],
  exports: [PostsService, PostsQueryRepo, IsPostExistConstraint],
})
export class PostsModule {}
