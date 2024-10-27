import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CodeRecoveryEntityPg } from '../domain/code-recovery.entity.pg';

@Injectable()
export class CodeRecoveryRepoPg {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async add(dto: CodeRecoveryEntityPg) {
    const [{ id }] = await this.dataSource.query(`
    INSERT INTO "CodeRecovery" ("userId") 
    VALUES ('${dto.userId}')
    RETURNING id
    `);

    return id;
  }
  async findById(id: string) {
    const [result = null] = await this.dataSource.query(
      `SELECT * FROM "CodeRecovery" as e
     WHERE e.id='${id}'`
    );
    if (!result) return null;
    return result;
  }
}
