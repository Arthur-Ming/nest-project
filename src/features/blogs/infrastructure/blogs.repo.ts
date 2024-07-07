import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../application/dto/create-blog.dto';
import { UpdateBlogDto } from '../application/dto/update-blog.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsRepo {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async add(createBlogDTO: CreateBlogDto) {
    const newBlog = await this.blogModel.create(createBlogDTO);
    return newBlog._id.toString();
  }
  async update(blogId: string, input: UpdateBlogDto): Promise<boolean> {
    const updateResult = await this.blogModel.updateOne(
      { _id: new ObjectId(blogId) },
      {
        $set: input,
      }
    );

    return updateResult.matchedCount === 1;
  }
  existsById(id: string) {
    return this.blogModel.exists({ _id: new ObjectId(id) });
  }
  async remove(blogId: string): Promise<boolean> {
    const deleteResult = await this.blogModel.deleteOne({ _id: new ObjectId(blogId) });
    return deleteResult.deletedCount === 1;
  }
}
