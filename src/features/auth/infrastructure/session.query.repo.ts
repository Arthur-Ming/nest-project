import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from '../domain/session.entity';
import { Model } from 'mongoose';
import { WithId } from 'mongodb';

@Injectable()
export class SessionQueryRepo {
  private mapToOutput = (session: WithId<Session>) => {
    return {
      ip: session.ip,
      title: session.deviceName,
      lastActiveDate: new Date(session.iat * 1000).toISOString(),
      deviceId: session._id.toString(),
    };
  };
  constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) {}

  // async getById(id: string) {
  //   return this.sessionModel.findById(new ObjectId(id));
  // }
  //
  // async getAllUserSessions(deviceId: string) {
  //   const session = await this.sessionModel.findById(new ObjectId(deviceId));
  //   if (!session) return null;
  //
  //   const allUserSessions = await this.sessionModel.find({ userId: session.userId });
  //   return allUserSessions.map((i) => this.mapToOutput(i));
  // }
}
