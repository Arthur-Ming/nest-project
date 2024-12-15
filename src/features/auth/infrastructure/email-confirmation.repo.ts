import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailConfirmation, IEmailConfirmation } from '../domain/email-confirmation.entity';

@Injectable()
export class EmailConfirmationRepo {
  constructor(
    @InjectRepository(EmailConfirmation)
    private emailConfirmationRepository: Repository<EmailConfirmation>
  ) {}

  async add(dto: IEmailConfirmation) {
    const u = await this.emailConfirmationRepository.save({
      exp: dto.exp,
      isConfirmed: dto.isConfirmed,
      userId: dto.userId,
    });

    return u.id;
  }

  async findByConfirmationCode(confirmationCode: string) {
    return await this.emailConfirmationRepository.findOneBy({
      id: confirmationCode,
    });
  }

  async findByUserId(userId: string) {
    return await this.emailConfirmationRepository.findOneBy({
      userId,
    });
  }

  async deleteByUserId(userId: string) {
    const deleteResult = await this.emailConfirmationRepository.delete({ userId });

    return deleteResult.affected === 1;
  }

  async setConfirmedById(id: string) {
    const updateResult = await this.emailConfirmationRepository.update(id, {
      isConfirmed: true,
    });

    return updateResult.affected === 1;
  }
}
