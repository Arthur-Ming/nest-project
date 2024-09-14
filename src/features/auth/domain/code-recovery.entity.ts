import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

export type CodeRecoveryDocument = HydratedDocument<CodeRecovery>;

@Schema()
export class CodeRecovery {
  @Prop()
  userId: ObjectId;

  @Prop()
  createdAt: number;
}

export const CodeRecoverySchema = SchemaFactory.createForClass(CodeRecovery);
