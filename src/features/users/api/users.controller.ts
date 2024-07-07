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
import { setPagination } from '../../../utils/set-pagination';

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
    return this.usersQueryRepo.findAll(setPagination(queryParams));
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
