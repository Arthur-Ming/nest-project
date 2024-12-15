import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISession, Session } from '../domain/session.entity';

@Injectable()
export class SessionRepo {
  constructor(@InjectRepository(Session) private sessionsRepository: Repository<Session>) {}

  async add(dto: ISession) {
    const s = await this.sessionsRepository.save({
      iat: dto.iat,
      exp: dto.exp,
      ip: dto.ip,
      deviceName: dto.deviceName,
      userId: dto.userId,
    });

    return s.id;
  }

  async findById(id: string) {
    return await this.sessionsRepository.findOneBy({
      id,
    });
  }

  async update(sessionId: string, dto: Partial<ISession>): Promise<boolean> {
    const updateResult = await this.sessionsRepository.update(sessionId, {
      exp: dto.exp,
      iat: dto.iat,
    });
    return updateResult.affected === 1;
  }

  async remove(sessionId: string): Promise<boolean> {
    const deleteResult = await this.sessionsRepository.delete(sessionId);

    return deleteResult.affected === 1;
  }

  removeExcludeCurrent = async (currentDeviceId: string) => {
    const deleteResult = await this.sessionsRepository
      .createQueryBuilder()
      .delete()
      .where('id != :e', { e: currentDeviceId })
      .execute();

    return deleteResult.affected === 1;
  };
}
