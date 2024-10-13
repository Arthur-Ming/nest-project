import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs.entity';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsQueryRepo } from './infrastructure/blogs.query-repo';
import { BlogsRepo } from './infrastructure/blogs.repo';
import { IsBlogExistConstraint } from './decorators/validate/is-blog-exist';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { IsBlogByIdExistConstraint } from './decorators/validate/is-blog-by-id-exist';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    PostsModule,
    AuthModule,
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsQueryRepo,
    BlogsRepo,
    IsBlogExistConstraint,
    IsBlogByIdExistConstraint,
  ],
  exports: [BlogsService, BlogsQueryRepo, IsBlogExistConstraint],
})
export class BlogsModule {}
