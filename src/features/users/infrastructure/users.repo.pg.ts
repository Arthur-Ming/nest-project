import { Injectable } from '@nestjs/common';
import { User } from '../domain/users.entity.pg';
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
  async findByLoginOrEmail(loginOrEmail: string) {
    const [user = null] = await this.dataSource.query(`
       SELECT * FROM "Users" 
       WHERE email='${loginOrEmail}' OR login='${loginOrEmail}'
    `);
    return user;
  }

  async findByEmail(email: string) {
    const [user = null] = await this.dataSource.query(`
       SELECT * FROM "Users" 
       WHERE email='${email}'
    `);
    return user;
  }

  async findById(userId: string) {
    const [user = null] = await this.dataSource.query(`
       SELECT * FROM "Users" 
       WHERE id='${userId}'
    `);
    return user;
  }

  async updatePassword(userId: string, newPasswordHash: string) {
    const [, matchedCount] = await this.dataSource.query(
      `UPDATE "Users" 
             SET "password" = '${newPasswordHash}'
       WHERE id = '${userId}'     
             `
    );

    return matchedCount === 1;
  }
}
