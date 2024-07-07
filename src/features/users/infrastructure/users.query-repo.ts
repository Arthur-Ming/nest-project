import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/users.entity';
import { Model } from 'mongoose';
import { UsersQueryParamsInputModel } from '../api/models/input/users-query-params.input.model';
import { Pagination } from '../../../common/types';
import { UsersOutputModel } from '../api/models/output/users.output.model';
import { BlogsQueryParams } from '../../blogs/api/models/input/blogs-query-params.input.model';
import { userMapToOutput } from '../application/utils/user-map-to-output';

const filter = ({ searchNameTerm }: BlogsQueryParams) => {
  return searchNameTerm
    ? {
        name: {
          $regex: searchNameTerm,
          $options: 'i',
        },
      }
    : {};
};

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getTotalCount = async (queryParams: UsersQueryParamsInputModel) => {
    return this.userModel.countDocuments(filter(queryParams));
  };

  async findAll(queryParams: UsersQueryParamsInputModel): Promise<Pagination<UsersOutputModel[]>> {
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
}
