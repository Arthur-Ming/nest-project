import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../api/models/dto/create-blog.dto';

@Injectable()
export class BlogsRepo {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async add(createBlogDTO: CreateBlogDto) {
    const newBlog = await this.blogModel.create(createBlogDTO);
    return newBlog;
  }
}
