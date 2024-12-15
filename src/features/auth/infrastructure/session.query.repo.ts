import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Session } from '../domain/session.entity';

@Injectable()
export class SessionQueryRepo {
  private mapToOutput = (session: any) => {
    return {
      ip: session.ip,
      title: session.deviceName,
      lastActiveDate: new Date(Number(session.iat) * 1000).toISOString(),
      deviceId: session.id.toString(),
    };
  };
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Session) private sessionsRepository: Repository<Session>
  ) {}

  async getAllUserSessions(deviceId: string) {
    const session = await this.sessionsRepository.findOneBy({
      id: deviceId,
    });

    if (!session) return null;
    const userSessions = await this.sessionsRepository.findBy({
      userId: session.userId,
    });

    return userSessions.map((us) => this.mapToOutput(us));
  }
}
