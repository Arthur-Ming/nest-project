import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../../domain/mg/comments.entity';
import { ObjectId } from 'mongodb';
import { UpdateCommentDto } from '../../api/dto/input/update-comment.dto';

@Injectable()
export class CommentsRepo {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async add(comment: Comment) {
    const newComment = await this.commentModel.create(comment);
    return newComment._id.toString();
  }
  async update(commentId: string, dto: UpdateCommentDto): Promise<boolean> {
    const updateResult = await this.commentModel.updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content: dto.content,
        },
      }
    );

    return updateResult.matchedCount === 1;
  }
  async removeById(id: string) {
    const deleteResult = await this.commentModel.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount === 1;
  }
  async getById(id: string) {
    return this.commentModel.findById(id);
  }
  existsById(id: string) {
    return this.commentModel.exists({ _id: new ObjectId(id) });
  }
}
