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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepo } from '../infrastructure/users.query-repo';
import { CreateUserDto } from './dto/input/create-user.dto';
import { UsersPaginationQueryParamsDto } from './dto/input/users-pagination-query-params.dto';
import { UserByIdDto } from './dto/input/user-by-id.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';

@SkipThrottle()
@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepo: UsersQueryRepo
  ) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  getUsers(
    @Query()
    queryParams: UsersPaginationQueryParamsDto
  ) {
    return this.usersQueryRepo.findAll(queryParams);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addUser(@Body() addUserModel: CreateUserDto) {
    const addedUserId = await this.usersService.addUser(addUserModel);
    return await this.usersQueryRepo.findById(addedUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param() params: UserByIdDto) {
    await this.usersService.deleteUser(params.id);
  }
}
