import { ResultStatusEnum } from './result-status.enum';
import { HttpException } from '@nestjs/common';

export class InterlayerNotice<T = null> {
  readonly status: ResultStatusEnum;
  // errorMessage?: string;
  // extensions?: ResultExtension[];
  private readonly data: T | null = null;

  constructor(status: ResultStatusEnum, data: T | null = null) {
    this.data = data;
    this.status = status;
    //  this.extensions = [];
  }
  getData(): T {
    if (this.data === null) {
      throw new HttpException('!!!', 500);
    }
    return this.data;
  }
}

// export class ResultExtension {
//   public readonly message: string;
//   public readonly key: string | null;
//   constructor(message: string, key: string | null = null) {
//     this.message = message;
//     this.key = key;
//   }
// }
