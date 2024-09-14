import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs.entity';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsQueryRepo } from './infrastructure/blogs.query-repo';
import { BlogsRepo } from './infrastructure/blogs.repo';
import { IsBlogExistConstraint } from './decorators/validate/is-blog-exist';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]), PostsModule],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsQueryRepo, BlogsRepo, IsBlogExistConstraint],
})
export class BlogsModule {}
