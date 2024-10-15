import { Controller, Delete, HttpCode } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/domain/users.entity';
import { Blog } from '../blog-platform/blogs/domain/blogs.entity';
import { Post } from '../blog-platform/posts/domain/posts.entity';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
  }
}
