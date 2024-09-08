import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailConfirmation } from '../domain/email-confirmation.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class EmailConfirmationRepo {
  constructor(
    @InjectModel(EmailConfirmation.name) private emailConfirmationModel: Model<EmailConfirmation>
  ) {}

  async add(dto: EmailConfirmation) {
    const newConfirmation = await this.emailConfirmationModel.create(dto);
    return newConfirmation._id.toString();
  }

  async findById(id: string) {
    const result = await this.emailConfirmationModel.findById(new ObjectId(id));
    if (!result) return null;
    return result;
  }

  async findByConfirmationCode(confirmationCode: string) {
    const result = await this.emailConfirmationModel.findOne({ confirmationCode });
    if (!result) return null;
    return result;
  }
}