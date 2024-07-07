import { ObjectId } from 'mongodb';

export interface UpdatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
}
