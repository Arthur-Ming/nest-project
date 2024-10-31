import { Entity } from 'typeorm';

@Entity()
export class User {
  login: string;

  password: string;

  email: string;

  createdAt: number;
}
