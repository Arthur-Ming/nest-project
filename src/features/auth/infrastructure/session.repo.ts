import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../domain/session.entity';

@Injectable()
export class SessionRepo {
  constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) {}

  // async add(dto: Session) {
  //   const newSession = await this.sessionModel.create(dto);
  //   return newSession._id.toString();
  // }
  //
  // async findById(id: string) {
  //   const result = await this.sessionModel.findById(new ObjectId(id));
  //   if (!result) return null;
  //   return result;
  // }
  //
  // async findAllByUserId(userId: string) {
  //   return this.sessionModel.find({ userId: new ObjectId(userId) });
  // }
  //
  // async update(sessionId: string, dto: Partial<Session>): Promise<boolean> {
  //   const updateResult = await this.sessionModel.updateOne(
  //     { _id: new ObjectId(sessionId) },
  //     {
  //       $set: dto,
  //     }
  //   );
  //
  //   return updateResult.matchedCount === 1;
  // }
  //
  // async remove(sessionId: string): Promise<boolean> {
  //   const deleteResult = await this.sessionModel.deleteOne({ _id: new ObjectId(sessionId) });
  //   return deleteResult.deletedCount === 1;
  // }
  //
  // removeExcludeCurrent = async (currentDeviceId: string) => {
  //   const deleteResult = await this.sessionModel.deleteMany({
  //     _id: { $ne: new ObjectId(currentDeviceId) },
  //   });
  //   return deleteResult.deletedCount > 0;
  // };
}
