import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodeRecovery } from '../domain/code-recovery.entity';

@Injectable()
export class CodeRecoveryRepo {
  constructor(@InjectModel(CodeRecovery.name) private codeRecoveryModel: Model<CodeRecovery>) {}

  async add(dto: CodeRecovery) {
    const newCodeRecovery = await this.codeRecoveryModel.create(dto);
    return newCodeRecovery._id.toString();
  }
}
