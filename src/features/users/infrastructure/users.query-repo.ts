import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/users.entity';
import { Model } from 'mongoose';
import { Pagination } from '../../../common/types';
import { UsersOutputModel } from '../api/dto/output/users.output.model';
import { userMapToOutput } from '../application/utils/user-map-to-output';
import { UsersPaginationQueryParamsDto } from '../api/dto/input/users-pagination-query-params.dto';

const filter = ({ searchEmailTerm, searchLoginTerm }: UsersPaginationQueryParamsDto) => {
  return {
    $or: [
      {
        login: {
          $regex: searchLoginTerm,
          $options: 'i',
        },
      },
      {
        email: {
          $regex: searchEmailTerm,
          $options: 'i',
        },
      },
    ],
  };
};

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getTotalCount = async (queryParams: UsersPaginationQueryParamsDto) => {
    return this.userModel.countDocuments(filter(queryParams));
  };

  async findAll(
    queryParams: UsersPaginationQueryParamsDto
  ): Promise<Pagination<UsersOutputModel[]>> {
    const users = await this.userModel.find(
      filter(queryParams),
      {},
      {
        sort: { [queryParams.sortBy]: queryParams.sortDirection === 'asc' ? 1 : -1 },
        skip: (queryParams.pageNumber - 1) * queryParams.pageSize,
        limit: queryParams.pageSize,
      }
    );
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
    const user = await this.userModel.findById(userId);
    if (!user) return null;
    return userMapToOutput(user);
  }
}
