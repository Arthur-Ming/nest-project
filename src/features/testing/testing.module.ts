import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../blog-platform/blogs/domain/blogs.entity';
import { Post, PostSchema } from '../blog-platform/posts/domain/posts.entity';
import { PostLikes, PostLikesSchema } from '../blog-platform/posts/domain/posts-likes.entity';
import { Comment, CommentSchema } from '../blog-platform/comments/domain/comments.entity';
import {
  CommentLikes,
  CommentLikesSchema,
} from '../blog-platform/comments/domain/comment-likes.entity';
import { User, UserSchema } from '../users/domain/users.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: PostLikes.name, schema: PostLikesSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: CommentLikes.name, schema: CommentLikesSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TestingController],
})
export class TestingModule {}
