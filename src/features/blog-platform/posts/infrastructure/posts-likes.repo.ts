import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostLikes } from '../domain/posts-likes.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsLikesRepo {
  constructor(@InjectModel(PostLikes.name) private postLikesModel: Model<PostLikes>) {}

  async put(dto: PostLikes) {
    const upsertResult = await this.postLikesModel.updateOne(
      {
        authorId: new ObjectId(dto.authorId),
        postId: new ObjectId(dto.postId),
      },
      { $set: { status: dto.status, createdAt: dto.createdAt } },
      { upsert: true }
    );
    return upsertResult.matchedCount === 1;
  }
}
