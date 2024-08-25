import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../infrastructure/users.repo';
import { CryptoService } from '../../../services/crypto/crypto.service';
import { CreateUserDto } from '../api/dto/input/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepo: UsersRepo,
    private cryptoService: CryptoService
  ) {}

  async addUser(addUserModel: CreateUserDto) {
    const hash = await this.cryptoService.hash(addUserModel.password);
    return await this.usersRepo.add({
      password: hash,
      login: addUserModel.login,
      email: addUserModel.email,
      createdAt: Number(new Date()),
    });
  }

  async deleteUser(userId: string) {
    await this.usersRepo.remove(userId);
  }
}
