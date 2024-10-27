import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EmailConfirmation } from '../domain/email-confirmation.entity.pg';

@Injectable()
export class EmailConfirmationRepoPg {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  // async add(dto: EmailConfirmation) {
  //   const newConfirmation = await this.emailConfirmationModel.create(dto);
  //   return newConfirmation._id.toString();
  // }
  async add(dto: EmailConfirmation) {
    const [{ id }] = await this.dataSource.query(`
    INSERT INTO "EmailConfirmation" ("userId", "isConfirmed", "exp") 
    VALUES ('${dto.userId}', '${dto.isConfirmed}', '${dto.exp}')
    RETURNING id
    `);

    return id;
  }

  //
  // async findById(id: string) {
  //   const result = await this.emailConfirmationModel.findById(new ObjectId(id));
  //   if (!result) return null;
  //   return result;
  // }
  //
  async findByConfirmationCode(confirmationCode: string) {
    const [result = null] = await this.dataSource.query(
      `SELECT * FROM "EmailConfirmation" as e
     WHERE e.id='${confirmationCode}'`
    );

    return result;
  }
  //
  async findByUserId(userId: string) {
    const [result = null] = await this.dataSource.query(
      `SELECT * FROM "EmailConfirmation" as e
     WHERE e."userId"='${userId}'`
    );
    if (!result) return null;
    return result;
  }

  async setConfirmed(confirmationCode: string) {
    const [, matchedCount] = await this.dataSource.query(
      `UPDATE "EmailConfirmation" 
             SET "isConfirmed" = true
       WHERE id = '${confirmationCode}'     
             `
    );
    return matchedCount === 1;
  }

  async setConfirmedByUserId(userId: string) {
    const [, matchedCount] = await this.dataSource.query(
      `UPDATE "EmailConfirmation" 
             SET "isConfirmed" = true
       WHERE "userId" = '${userId}'     
             `
    );
    return matchedCount === 1;
  }
  // async updateConfirmationCodeByUserId(userId: string, newConfirmCode: string) {
  //   const updateResult = await this.emailConfirmationModel.updateOne(
  //     {
  //       userId: new ObjectId(userId),
  //     },
  //     {
  //       $set: {
  //         confirmationCode: newConfirmCode,
  //       },
  //     }
  //   );
  //   return updateResult.matchedCount === 1;
  // }
}
