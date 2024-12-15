import { Injectable } from '@nestjs/common';
import { IUser, User } from '../domain/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepo {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async add(user: IUser) {
    const u = await this.usersRepository.save({
      email: user.email,
      login: user.login,
      password: user.password,
    });

    return u.id;
  }

  async remove(userId: string) {
    const deleteResult = await this.usersRepository.delete(userId);

    return deleteResult.affected === 1;
  }
  async existsById(id: string) {
    return await this.usersRepository.existsBy({
      id,
    });
  }
  async existsByLogin(login: string) {
    return await this.usersRepository.existsBy({
      login,
    });
  }

  async existsByEmail(email: string) {
    return await this.usersRepository.existsBy({
      email,
    });
  }
  async findByLoginOrEmail(loginOrEmail: string) {
    return await this.usersRepository.findOneBy([
      {
        email: loginOrEmail,
      },
      {
        login: loginOrEmail,
      },
    ]);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({
      email,
    });
  }

  async findById(userId: string) {
    return await this.usersRepository.findOneBy({
      id: userId,
    });
  }

  async updatePassword(userId: string, newPasswordHash: string) {
    const updateResult = await this.usersRepository.update(userId, { password: newPasswordHash });
    return updateResult.affected === 1;
  }
}
