import { Entity } from 'typeorm';

@Entity()
export class PostsEntity {
  title: string;

  shortDescription: string;

  content: string;

  createdAt?: Date;

  blogId: string;
}
