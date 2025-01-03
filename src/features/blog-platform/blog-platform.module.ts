import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { IsBlogExistConstraint } from './blogs/decorators/validate/is-blog-exist';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsRepo } from './posts/infrastructure/posts.repo';
import { PostsQueryRepo } from './posts/infrastructure/posts.query-repo';
import { CommentsController } from './comments/api/comments.controller';
import { PostsLikesRepo } from './posts/infrastructure/posts-likes.repo';
import { CommentsService } from './comments/application/comments.service';
import { CommentsRepo } from './comments/infrastructure/pg/comments.repo';
import { CommentsQueryRepo } from './comments/infrastructure/pg/comments.query-repo';
import { AuthModule } from '../auth/auth.module';
import { IsBlogByIdExistConstraint } from './blogs/decorators/validate/is-blog-by-id-exist';
import { IsCommentExistConstraint } from './comments/decorators/validate/is-comment-exist';
import { IsPostExistConstraint } from './posts/decorators/validate/is-post-exist';
import { BlogsQueryRepo } from './blogs/infrastructure/blogs.query-repo';
import { BlogsRepo } from './blogs/infrastructure/blogs.repo';
import { CommentsLikesRepo } from './comments/infrastructure/pg/comments-likes.repo';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blogs/domain/blogs.entity';
import { Post } from './posts/domain/posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Post]), AuthModule, UsersModule],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    BlogsQueryRepo,
    BlogsRepo,
    IsBlogExistConstraint,
    IsBlogByIdExistConstraint,
    PostsService,
    PostsRepo,
    PostsQueryRepo,
    PostsLikesRepo,
    IsPostExistConstraint,
    CommentsService,
    CommentsRepo,
    CommentsQueryRepo,
    CommentsLikesRepo,
    IsCommentExistConstraint,
  ],
})
export class BlogPlatformModule {}
