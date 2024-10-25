import { Injectable } from '@nestjs/common';
import { userMapToOutput } from '../application/utils/user-map-to-output';
import { UsersPaginationQueryParamsDto } from '../api/dto/input/users-pagination-query-params.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersQueryRepoPg {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  getTotalCount = async (queryParams: UsersPaginationQueryParamsDto) => {
    const [{ count: totalCount }] = await this.dataSource.query(`
    SELECT COUNT(*) FROM "Users"
        WHERE "Users".email LIKE '%${queryParams.searchEmailTerm}%' OR "Users".login LIKE '%${queryParams.searchLoginTerm}%'`);
    return Number(totalCount);
  };

  async findAll(queryParams: UsersPaginationQueryParamsDto) {
    const offSet = (queryParams.pageNumber - 1) * queryParams.pageSize;
    const limit = queryParams.pageSize;
    const users = await this.dataSource.query(`
    SELECT * FROM "Users"
          WHERE "Users".email LIKE '%${queryParams.searchEmailTerm}%' OR "Users".login LIKE '%${queryParams.searchLoginTerm}%'
          ORDER BY "${queryParams.sortBy}" ${queryParams.sortDirection}
          OFFSET ${offSet}
          LIMIT ${limit}
          `);
    const totalCount = await this.getTotalCount(queryParams);

    return {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount: totalCount,
      items: users.map((user) => userMapToOutput(user)),
    };
  }

  async findById(userId: string) {
    const [user] = await this.dataSource.query(`
  SELECT * FROM "Users"
  WHERE "Users".id='${userId}'`);
    if (!user) return null;
    return userMapToOutput(user);
  }
}
