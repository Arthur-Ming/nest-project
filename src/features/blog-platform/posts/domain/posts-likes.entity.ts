import { Entity } from 'typeorm';

@Entity()
export class PostsLikesEntity {
  authorId: string;

  postId: string;

  status: string;
}
