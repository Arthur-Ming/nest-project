import { Entity } from 'typeorm';

@Entity()
export class CodeRecoveryEntity {
  userId: string;
  createdAt?: Date;
}
