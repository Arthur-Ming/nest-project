import { Injectable } from '@nestjs/common';
import { SessionRepo } from '../infrastructure/session.repo';
import { InterlayerNotice } from '../../../base/result/result';
import { ResultStatusEnum } from '../../../base/result/result-status.enum';

@Injectable()
export class SecurityDevicesService {
  constructor(private readonly sessionRepo: SessionRepo) {}

  async removeExcludeCurrent(currentDeviceId: string) {
    return this.sessionRepo.removeExcludeCurrent(currentDeviceId);
  }

  async removeById(deviceIdFromParams: string, deviceIdFromCookie: string) {
    const session = await this.sessionRepo.findById(deviceIdFromCookie);
    if (!session) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }

    const sessionByParamsId = await this.sessionRepo.findById(deviceIdFromParams);
    if (!sessionByParamsId) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }

    const isUserHasDevice = session.userId.toString() === sessionByParamsId.userId.toString();
    if (!isUserHasDevice) {
      return new InterlayerNotice(ResultStatusEnum.Forbidden);
    }

    await this.sessionRepo.remove(deviceIdFromParams);
    return new InterlayerNotice(ResultStatusEnum.Success);
  }
}
