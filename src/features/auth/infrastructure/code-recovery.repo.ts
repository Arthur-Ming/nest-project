import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CodeRecoveryEntity } from '../domain/code-recovery.entity';

@Injectable()
export class CodeRecoveryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async add(dto: CodeRecoveryEntity) {
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
