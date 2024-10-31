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
  async updatePassword(userId: string, newPassword: string) {
    const hash = await this.cryptoService.hash(newPassword);
    return this.usersRepo.updatePassword(userId, hash);
  }

  async findById(userId: string) {
    return this.usersRepo.findById(userId);
  }
  async findByLoginOrEmail(loginOrEmail: string) {
    return this.usersRepo.findByLoginOrEmail(loginOrEmail);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  async deleteUser(userId: string) {
    await this.usersRepo.remove(userId);
  }
}
