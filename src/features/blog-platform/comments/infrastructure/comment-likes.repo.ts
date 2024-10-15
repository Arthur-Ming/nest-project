import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CommentLikes } from '../domain/comment-likes.entity';

@Injectable()
export class CommentLikesRepo {
  constructor(@InjectModel(CommentLikes.name) private commentLikesModel: Model<CommentLikes>) {}

  async put(dto: CommentLikes) {
    const upsertResult = await this.commentLikesModel.updateOne(
      {
        authorId: new ObjectId(dto.authorId),
        commentId: new ObjectId(dto.commentId),
      },
      { $set: { status: dto.status, createdAt: dto.createdAt } },
      { upsert: true }
    );
    return upsertResult.matchedCount === 1;
  }
}
