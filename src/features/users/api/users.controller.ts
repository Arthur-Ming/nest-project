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
import { CreateUserDto } from './dto/input/create-user.dto';
import { UsersQueryParamsDto } from './dto/input/users-query-params.dto';
import { UsersRepo } from '../infrastructure/users.repo';
import { UserByIdDto } from './dto/input/user-by-id.dto';

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
    queryParams: UsersQueryParamsDto
  ) {
    return this.usersQueryRepo.findAll(queryParams);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addUser(@Body() addUserModel: CreateUserDto) {
    const addedUser = this.usersService.addUser(addUserModel);
    return addedUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param() params: UserByIdDto) {
    await this.usersService.deleteUser(params.id);
  }
}
