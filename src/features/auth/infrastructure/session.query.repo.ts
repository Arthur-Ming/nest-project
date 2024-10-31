import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionQueryRepo {
  private mapToOutput = (session: any) => {
    return {
      ip: session.ip,
      title: session.deviceName,
      lastActiveDate: new Date(session.iat * 1000).toISOString(),
      deviceId: session.id.toString(),
    };
  };
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getById(id: string) {
    const [result = null] = await this.dataSource.query(
      `SELECT * FROM "Sessions" as s
     WHERE s.id='${id}'`
    );
    if (!result) return null;
    return result;
  }

  async getAllUserSessions(deviceId: string) {
    const [session = null] = await this.dataSource.query(
      `SELECT * FROM "Sessions" as s
     WHERE s.id='${deviceId}'`
    );
    if (!session) return null;

    const users = await this.dataSource.query(
      `SELECT * FROM "Sessions" as s
     WHERE s."userId"='${session.userId}'`
    );
    return users.map((i) => this.mapToOutput(i));
  }
}
