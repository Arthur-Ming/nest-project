import { Injectable } from '@nestjs/common';
import { User } from '../domain/users.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepoPg {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async add(user: User) {
    const [{ id }] = await this.dataSource.query(`
    INSERT INTO "Users" ("login", "password", "email") 
    VALUES ('${user.login}', '${user.password}', '${user.email}')
    RETURNING id
    `);

    return id;
  }

  async remove(userId: string) {
    const [, deleteResult] = await this.dataSource.query(`
   DELETE FROM "Users"
   WHERE id='${userId}'`);

    return deleteResult === 1;
  }
  async existsById(id: string) {
    const [{ exists }] = await this.dataSource.query(`
    SELECT EXISTS(SELECT * FROM "Users" WHERE id='${id}')
    `);
    return exists;
  }
  async existsByLogin(login: string) {
    const [{ exists }] = await this.dataSource.query(`
    SELECT EXISTS(SELECT * FROM "Users" WHERE login='${login}')
    `);
    return exists;
  }

  async existsByEmail(email: string) {
    const [{ exists }] = await this.dataSource.query(`
    SELECT EXISTS(SELECT * FROM "Users" WHERE email='${email}')
    `);
    return exists;
  }
  // async findByLoginOrEmail(loginOrEmail: string) {
  //   const user = await this.userModel.findOne({
  //     $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
  //   });
  //   if (!user) return null;
  //   return user;
  // }
  //
  // async findById(userId: string) {
  //   const user = await this.userModel.findById(userId);
  //   if (!user) return null;
  //   return user;
  // }
  //
  // async updatePassword(userId: string, newPasswordHash: string) {
  //   const updateResult = await this.userModel.updateOne(
  //     { _id: new ObjectId(userId) },
  //     {
  //       $set: {
  //         password: newPasswordHash,
  //       },
  //     }
  //   );
  //   return updateResult.matchedCount === 1;
  // }
}
