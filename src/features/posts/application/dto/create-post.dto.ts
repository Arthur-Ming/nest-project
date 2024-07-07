import { ObjectId } from 'mongodb';

export interface CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  createdAt: number;
}
