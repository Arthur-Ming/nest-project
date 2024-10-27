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
import { CreateUserDto } from './dto/input/create-user.dto';
import { UsersPaginationQueryParamsDto } from './dto/input/users-pagination-query-params.dto';
import { UserByIdDto } from './dto/input/user-by-id.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { UsersQueryRepoPg } from '../infrastructure/users.query-repo.pg';

@SkipThrottle()
@UseGuards(BasicAuthGuard)
@Controller('sa/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepoPg: UsersQueryRepoPg
  ) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  getUsers(
    @Query()
    queryParams: UsersPaginationQueryParamsDto
  ) {
    return this.usersQueryRepoPg.findAll(queryParams);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addUser(@Body() addUserModel: CreateUserDto) {
    const addedUserId = await this.usersService.addUser(addUserModel);
    return await this.usersQueryRepoPg.findById(addedUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param() params: UserByIdDto) {
    await this.usersService.deleteUser(params.id);
  }
}
