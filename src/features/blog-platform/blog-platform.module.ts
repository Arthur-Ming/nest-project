import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { IsBlogExistConstraint } from './blogs/decorators/validate/is-blog-exist';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsRepo } from './posts/infrastructure/posts.repo';
import { PostsQueryRepo } from './posts/infrastructure/posts.query-repo';
import { CommentsController } from './comments/api/comments.controller';
import { Comment, CommentSchema } from './comments/domain/comments.entity';
import { CommentLikes, CommentLikesSchema } from './comments/domain/comment-likes.entity';
import { PostsLikesRepo } from './posts/infrastructure/posts-likes.repo';
import { CommentsService } from './comments/application/comments.service';
import { PostLikes, PostLikesSchema } from './posts/domain/posts-likes.entity';
import { CommentsRepo } from './comments/infrastructure/comments.repo';
import { CommentsQueryRepo } from './comments/infrastructure/comments.query-repo';
import { CommentLikesRepo } from './comments/infrastructure/comment-likes.repo';
import { AuthModule } from '../auth/auth.module';
import { IsBlogByIdExistConstraint } from './blogs/decorators/validate/is-blog-by-id-exist';
import { IsCommentExistConstraint } from './comments/decorators/validate/is-comment-exist';
import { IsPostExistConstraint } from './posts/decorators/validate/is-post-exist';
import { BlogsQueryRepo } from './blogs/infrastructure/blogs.query-repo';
import { BlogsRepo } from './blogs/infrastructure/blogs.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PostLikes.name, schema: PostLikesSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: CommentLikes.name, schema: CommentLikesSchema }]),
    AuthModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    BlogsQueryRepo,
    BlogsRepo,
    IsBlogExistConstraint,
    IsBlogByIdExistConstraint,
    PostsService,
    PostsRepo,
    PostsRepo,
    PostsQueryRepo,
    PostsQueryRepo,
    PostsLikesRepo,
    IsPostExistConstraint,
    CommentsService,
    CommentsRepo,
    CommentsQueryRepo,
    CommentLikesRepo,
    IsCommentExistConstraint,
  ],
})
export class BlogPlatformModule {}
