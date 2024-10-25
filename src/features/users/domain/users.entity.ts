import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Entity } from 'typeorm';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  login: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

@Entity()
export class UserT {
  login: string;

  password: string;

  email: string;

  createdAt: number;
}
