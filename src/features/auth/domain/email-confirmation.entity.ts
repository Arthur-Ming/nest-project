import { Entity } from 'typeorm';

@Entity()
export class EmailConfirmation {
  userId: string;

  exp: number;

  isConfirmed: boolean;
}
