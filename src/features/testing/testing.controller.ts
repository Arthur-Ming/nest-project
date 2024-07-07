import { Controller, Delete, HttpCode } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../blogs/domain/blogs.entity';

@Controller('testing')
export class TestingController {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    await this.blogModel.deleteMany({});
  }
}
