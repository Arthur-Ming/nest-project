import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { CreateUserDto } from '../../users/api/dto/input/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async registration(dto: CreateUserDto) {
    await this.usersService.addUser(dto);
  }
}
