import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../domain/posts.entity';
import { ObjectId } from 'mongodb';
import { UpdatePostDto } from '../api/dto/input/update-post.dto';

@Injectable()
export class PostsRepo {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
  async add(post: Post) {
    const newPost = await this.postModel.create(post);
    return newPost._id.toString();
  }

  async remove(postId: string) {
    const deleteResult = await this.postModel.deleteOne({ _id: new ObjectId(postId) });
    return deleteResult.deletedCount === 1;
  }

  async update(postId: string, dto: UpdatePostDto): Promise<boolean> {
    const updateResult = await this.postModel.updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: new ObjectId(dto.blogId),
        },
      }
    );

    return updateResult.matchedCount === 1;
  }

  existsById(id: string) {
    return this.postModel.exists({ _id: new ObjectId(id) });
  }
}
