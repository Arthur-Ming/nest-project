import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;

@Schema()
export class EmailConfirmation {
  @Prop()
  userId: ObjectId;

  @Prop()
  confirmationCode: string;

  @Prop()
  expirationDate: number;

  @Prop()
  isConfirmed: boolean;
}

export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);
