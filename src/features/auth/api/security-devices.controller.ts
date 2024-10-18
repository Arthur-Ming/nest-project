import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtRefreshTokenGuard } from '../guards/jwt-refresh-token.guard';
import { SecurityDevicesRoutes } from '../routes/security-devices.routes';
import { CurrentDeviceId } from '../decorators/current-device-id';
import { SessionQueryRepo } from '../infrastructure/session.query.repo';
import { SecurityDevicesService } from '../application/security-devices.service';
import { DeviceById } from './dto/input/device-by-id';
import { ResultStatusEnum } from '../../../base/result/result-status.enum';

@SkipThrottle()
@Controller(SecurityDevicesRoutes.base)
export class SecurityDevicesController {
  constructor(
    private sessionQueryRepo: SessionQueryRepo,
    private securityDevicesService: SecurityDevicesService
  ) {}

  @UseGuards(JwtRefreshTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@CurrentDeviceId() deviceId) {
    console.log('getAll');
    console.log(deviceId);
    return await this.sessionQueryRepo.getAllUserSessions(deviceId);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async del(@CurrentDeviceId() deviceId) {
    await this.securityDevicesService.removeExcludeCurrent(deviceId);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param() params: DeviceById, @CurrentDeviceId() deviceId) {
    const result = await this.securityDevicesService.removeById(params.id, deviceId);
    if (result.status === ResultStatusEnum.NotFound) {
      throw new NotFoundException();
    }
    if (result.status === ResultStatusEnum.Forbidden) {
      throw new ForbiddenException();
    }
  }
}
