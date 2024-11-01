import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from '../domain/session.entity';

@Injectable()
export class SessionRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async add(dto: SessionEntity) {
    const [{ id }] = await this.dataSource.query(`
    INSERT INTO "Sessions" ("iat", "exp", "ip", "deviceName", "userId") 
    VALUES ('${dto.iat}', '${dto.exp}', '${dto.ip}', '${dto.deviceName}', '${dto.userId}')
    RETURNING id
    `);

    return id;
  }

  async findById(id: string) {
    const [result = null] = await this.dataSource.query(
      `SELECT * FROM "Sessions" as s
     WHERE s.id='${id}'`
    );
    if (!result) return null;
    return result;
  }

  async findAllByUserId(userId: string) {
    const [result = null] = await this.dataSource.query(
      `SELECT * FROM "Sessions" as s
     WHERE s.userId='${userId}'`
    );
    if (!result) return null;
    return result;
  }

  async update(sessionId: string, dto: Partial<SessionEntity>): Promise<boolean> {
    const [, matchedCount] = await this.dataSource.query(
      `UPDATE "Sessions" 
             SET "exp" = ${dto.exp},
             "iat" = ${dto.iat}
       WHERE id = '${sessionId}'     
             `
    );
    return matchedCount === 1;
  }

  async remove(sessionId: string): Promise<boolean> {
    const [, deleteResult] = await this.dataSource.query(`
   DELETE FROM "Sessions"
   WHERE id='${sessionId}'`);

    return deleteResult === 1;
  }

  removeExcludeCurrent = async (currentDeviceId: string) => {
    const [, deleteResult] = await this.dataSource.query(`
   DELETE FROM "Sessions"
   WHERE id!='${currentDeviceId}'`);

    return deleteResult === 1;
  };
}
