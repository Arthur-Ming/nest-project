import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailConfirmation } from '../domain/email-confirmation.entity';

@Injectable()
export class EmailConfirmationRepo {
  constructor(
    @InjectModel(EmailConfirmation.name) private emailConfirmationModel: Model<EmailConfirmation>
  ) {}

  // async add(dto: EmailConfirmation) {
  //   const newConfirmation = await this.emailConfirmationModel.create(dto);
  //   return newConfirmation._id.toString();
  // }
  //
  // async findById(id: string) {
  //   const result = await this.emailConfirmationModel.findById(new ObjectId(id));
  //   if (!result) return null;
  //   return result;
  // }
  //
  // async findByConfirmationCode(confirmationCode: string) {
  //   const result = await this.emailConfirmationModel.findOne({ confirmationCode });
  //   if (!result) return null;
  //   return result;
  // }
  //
  // async findByUserId(userId: string) {
  //   const result = await this.emailConfirmationModel.findOne({ userId: new ObjectId(userId) });
  //   if (!result) return null;
  //   return result;
  // }
  //
  // async setConfirmed(confirmationCode: string) {
  //   const updateResult = await this.emailConfirmationModel.updateOne(
  //     {
  //       confirmationCode: confirmationCode,
  //     },
  //     {
  //       $set: {
  //         isConfirmed: true,
  //       },
  //     }
  //   );
  //   return updateResult.matchedCount === 1;
  // }
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
