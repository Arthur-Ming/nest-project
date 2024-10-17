import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
  @Prop()
  iat: number;

  @Prop()
  exp: number;

  @Prop()
  ip: string;

  @Prop()
  deviceName: string;

  @Prop()
  userId: ObjectId;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
