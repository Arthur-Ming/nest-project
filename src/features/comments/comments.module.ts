import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './domain/comments.entity';
import { CommentsController } from './api/comments.controller';
import { CommentsService } from './application/comments.service';
import { CommentsRepo } from './infrastructure/comments.repo';
import { CommentsQueryRepo } from './infrastructure/comments.query-repo';
import { IsCommentExistConstraint } from './decorators/validate/is-comment-exist';
import { AuthModule } from '../auth/auth.module';
import { CommentLikes, CommentLikesSchema } from './domain/comment-likes.entity';
import { CommentLikesRepo } from './infrastructure/comment-likes.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: CommentLikes.name, schema: CommentLikesSchema }]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepo,
    CommentsQueryRepo,
    CommentLikesRepo,
    IsCommentExistConstraint,
  ],
  exports: [CommentsService, CommentsQueryRepo],
})
export class CommentsModule {}
