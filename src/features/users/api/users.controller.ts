import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepo } from '../infrastructure/users.query-repo';
import { UsersInputBody } from './models/input/users.input.model';
import { UsersQueryParamsInputModel } from './models/input/users-query-params.input.model';
import { SortDirections } from '../../../common/types/interfaces';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepo: UsersQueryRepo
  ) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  getBlogs(
    @Query()
    queryParams: UsersQueryParamsInputModel
  ) {
    const {
      searchNameTerm = '',
      sortBy = 'createdAt',
      sortDirection = SortDirections.desc,
      pageNumber = 1,
      pageSize = 10,
    } = queryParams;

    return this.usersQueryRepo.findAll({
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    });
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addUser(@Body() addUserModel: UsersInputBody) {
    const addedUser = this.usersService.addUser(addUserModel);
    return addedUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
  }
}
