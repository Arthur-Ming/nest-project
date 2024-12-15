import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeRecovery, ICodeRecovery } from '../domain/code-recovery.entity';

@Injectable()
export class CodeRecoveryRepo {
  constructor(
    @InjectRepository(CodeRecovery) private codeRecoveryRepository: Repository<CodeRecovery>
  ) {}

  async add(dto: ICodeRecovery) {
    const result = await this.codeRecoveryRepository.save({
      userId: dto.userId,
    });

    return result.id;
  }

  async deleteAllUserCodeRecoveries(userId: string) {
    const deleteResult = await this.codeRecoveryRepository.delete({
      userId,
    });

    return deleteResult.affected === 1;
  }
  async findById(id: string) {
    return await this.codeRecoveryRepository.findOneBy({
      id,
    });
  }
}
