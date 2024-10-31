import { Entity } from 'typeorm';

@Entity()
export class BlogsEntity {
  name: string;

  description: string;

  websiteUrl: string;

  createdAt?: Date;

  isMembership: boolean;
}
