import { Injectable } from '@nestjs/common';
import { InterlayerNotice } from '../../../base/result/result';
import { ResultStatusEnum } from '../../../base/result/result-status.enum';
import { SessionRepoPg } from '../infrastructure/session.repo.pg';

@Injectable()
export class SecurityDevicesService {
  constructor(private readonly sessionRepoPg: SessionRepoPg) {}

  async removeExcludeCurrent(currentDeviceId: string) {
    return this.sessionRepoPg.removeExcludeCurrent(currentDeviceId);
  }

  async removeById(deviceIdFromParams: string, deviceIdFromCookie: string) {
    const session = await this.sessionRepoPg.findById(deviceIdFromCookie);
    if (!session) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }

    const sessionByParamsId = await this.sessionRepoPg.findById(deviceIdFromParams);
    if (!sessionByParamsId) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }

    const isUserHasDevice = session.userId.toString() === sessionByParamsId.userId.toString();
    if (!isUserHasDevice) {
      return new InterlayerNotice(ResultStatusEnum.Forbidden);
    }

    await this.sessionRepoPg.remove(deviceIdFromParams);
    return new InterlayerNotice(ResultStatusEnum.Success);
  }
}
