import { Entity } from 'typeorm';

@Entity()
export class CommentLikesEntity {
  authorId: string;

  commentId: string;

  status: string;
}
