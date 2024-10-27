import { Entity } from 'typeorm';

@Entity()
export class SessionEntityPg {
  iat: number;

  exp: number;

  ip: string;

  deviceName: string;

  userId: string;
}
