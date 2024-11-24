import { Entity } from 'typeorm';

@Entity()
export class CommentsEntity {
  content: string;

  postId: string;

  userId: string;
}
