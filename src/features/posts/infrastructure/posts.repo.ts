import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../domain/posts.entity';
import { CreatePostDto } from '../application/dto/create-post.dto';
import { ObjectId } from 'mongodb';
import { UpdatePostDto } from '../application/dto/update-post.dto';

@Injectable()
export class PostsRepo {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
  async add(createPostDto: CreatePostDto) {
    const newPost = await this.postModel.create(createPostDto);
    return newPost._id.toString();
  }

  async remove(postId: string) {
    const deleteResult = await this.postModel.deleteOne({ _id: new ObjectId(postId) });
    return deleteResult.deletedCount === 1;
  }

  async update(postId: string, input: UpdatePostDto): Promise<boolean> {
    const updateResult = await this.postModel.updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: input,
      }
    );

    return updateResult.matchedCount === 1;
  }

  existsById(id: string) {
    return this.postModel.exists({ _id: new ObjectId(id) });
  }
}
