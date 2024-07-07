import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepo } from '../infrastructure/users.query-repo';
import { UsersInputBody } from './models/input/users.input.model';
import { UsersQueryParamsInputModel } from './models/input/users-query-params.input.model';
import { setPagination } from '../../../utils/set-pagination';
import { UsersRepo } from '../infrastructure/users.repo';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepo: UsersQueryRepo,
    private usersRepo: UsersRepo
  ) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  getUsers(
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
    const existsBlog = await this.usersRepo.existsById(id);

    if (!existsBlog) {
      throw new HttpException(`Post with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.usersService.deleteUser(id);
  }
}
