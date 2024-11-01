import { Entity } from 'typeorm';

@Entity()
export class SessionEntity {
  iat: number;

  exp: number;

  ip: string;

  deviceName: string;

  userId: string;
}
