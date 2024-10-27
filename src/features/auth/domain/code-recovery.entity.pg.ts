import { Entity } from 'typeorm';

@Entity()
export class CodeRecoveryEntityPg {
  userId: string;
  createdAt?: Date;
}
