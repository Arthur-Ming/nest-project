import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type CommentLikesDocument = HydratedDocument<CommentLikes>;

@Schema()
export class CommentLikes {
  @Prop()
  authorId: ObjectId;

  @Prop()
  createdAt: number;

  @Prop()
  commentId: ObjectId;

  @Prop()
  status: string;
}

export const CommentLikesSchema = SchemaFactory.createForClass(CommentLikes);
