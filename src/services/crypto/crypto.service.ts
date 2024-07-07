import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import cryptoConfig from './crypto.config';

@Injectable()
export class CryptoService {
  private async genSalt(saltRounds) {
    const salt = await bcrypt.genSalt(saltRounds);
    return salt;
  }
  async hash(password: string, saltRounds: number = cryptoConfig.saltRounds) {
    const salt = await this.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
