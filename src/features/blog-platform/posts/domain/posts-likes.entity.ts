import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type PostLikesDocument = HydratedDocument<PostLikes>;

@Schema()
export class PostLikes {
  @Prop()
  authorId: ObjectId;

  @Prop()
  createdAt: number;

  @Prop()
  postId: ObjectId;

  @Prop()
  status: string;
}

export const PostLikesSchema = SchemaFactory.createForClass(PostLikes);
