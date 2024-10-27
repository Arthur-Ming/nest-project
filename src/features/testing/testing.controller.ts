import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    const [, deleteResult] = await this.dataSource.query(`
   DELETE FROM "Users";
   
     `);

    return deleteResult === 1;
  }
}
