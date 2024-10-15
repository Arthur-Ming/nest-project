import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  content: string;

  @Prop()
  createdAt: number;

  @Prop()
  postId: ObjectId;

  @Prop()
  userId: ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
