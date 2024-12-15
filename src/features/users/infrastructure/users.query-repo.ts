import { Injectable } from '@nestjs/common';
import { userMapToOutput } from '../application/utils/user-map-to-output';
import { UsersPaginationQueryParamsDto } from '../api/dto/input/users-pagination-query-params.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/users.entity';

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  getTotalCount = async (queryParams: UsersPaginationQueryParamsDto) => {
    return await this.usersRepository
      .createQueryBuilder('u')
      .where('u.email ILIKE :e', { e: `%${queryParams.searchEmailTerm}%` })
      .orWhere('u.login ILIKE :l', { l: `%${queryParams.searchLoginTerm}%` })
      .getCount();
  };

  async findAll(queryParams: UsersPaginationQueryParamsDto) {
    const offSet = (queryParams.pageNumber - 1) * queryParams.pageSize;
    const limit = queryParams.pageSize;
    const d =
      queryParams.sortBy === 'createdAt' ? `"createdAt"` : `"${queryParams.sortBy}" COLLATE "C"`;

    const sortDirection = queryParams.sortDirection.toUpperCase() as 'ASC' | 'DESC';
    const users = await this.usersRepository
      .createQueryBuilder('u')
      .where('u.email ILIKE :e', { e: `%${queryParams.searchEmailTerm}%` })
      .orWhere('u.login ILIKE :l', { l: `%${queryParams.searchLoginTerm}%` })
      .orderBy(d, sortDirection)
      .offset(offSet)
      .limit(limit)
      .getMany();

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
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (!user) return null;
    return userMapToOutput(user);
  }
}
