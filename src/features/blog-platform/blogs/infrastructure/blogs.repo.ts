import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UpdateBlogDto } from '../api/dto/input/update-blog.dto';

@Injectable()
export class BlogsRepo {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async add(blog: Blog) {
    const newBlog = await this.blogModel.create(blog);
    return newBlog._id.toString();
  }
  async update(blogId: string, dto: UpdateBlogDto): Promise<boolean> {
    const updateResult = await this.blogModel.updateOne(
      { _id: new ObjectId(blogId) },
      {
        $set: dto,
      }
    );

    return updateResult.matchedCount === 1;
  }
  existsById(id: string) {
    console.log(id);
    return this.blogModel.exists({ _id: new ObjectId(id) });
  }
  async remove(blogId: string): Promise<boolean> {
    const deleteResult = await this.blogModel.deleteOne({ _id: new ObjectId(blogId) });
    return deleteResult.deletedCount === 1;
  }
}
