import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthRoutes } from '../routes/auth-routes';
import { CreateUserDto } from '../../users/api/dto/input/create-user.dto';
import { AuthService } from '../application/auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { LoginUserDto } from './dto/input/login-user.dto';
import { ResultStatusEnum } from '../../../base/result/result-status.enum';
import { ConfirmDto } from './dto/input/confirm.dto';
import { RegistrationEmailResendingDto } from './dto/input/registration-email-resending.dto';
import { PasswordRecoveryDto } from './dto/input/password-recovery.dto';
import { NewPasswordDto } from './dto/input/new-password.dto';
import { Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUserId } from '../decorators/current-user';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DeviceName } from '../decorators/device-name';
import { JwtRefreshTokenGuard } from '../guards/jwt-refresh-token.guard';
import { CurrentDeviceId } from '../decorators/current-device-id';

@SkipThrottle()
@Controller(AuthRoutes.base)
export class AuthController {
  constructor(private authService: AuthService) {}
  @SkipThrottle({ default: false })
  @Post(AuthRoutes.registration)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: CreateUserDto) {
    await this.authService.registration(dto);
  }
  @SkipThrottle({ default: false })
  @Post(AuthRoutes.passwordRecovery)
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() dto: PasswordRecoveryDto) {
    const result = await this.authService.passwordRecovery(dto.email);
    if (result.status === ResultStatusEnum.NotFound) {
      throw new BadRequestException();
    }
  }

  @SkipThrottle({ default: false })
  @Post(AuthRoutes.newPassword)
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() dto: NewPasswordDto) {
    await this.authService.newPassword(dto);
  }
  @SkipThrottle({ default: false })
  @Post(AuthRoutes.registrationConfirmation)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() dto: ConfirmDto) {
    await this.authService.registrationConfirmation(dto.code);
  }
  @SkipThrottle({ default: false })
  @Post(AuthRoutes.registrationEmailResending)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() dto: RegistrationEmailResendingDto) {
    await this.authService.registrationEmailResending(dto.email);
  }
  @UseGuards(LocalAuthGuard)
  @Post(AuthRoutes.login)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @CurrentUserId() userId,
    @DeviceName() deviceName,
    @Ip() ip,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.login(loginUserDto, {
      ip,
      deviceName,
      userId,
    });
    if (result.status === ResultStatusEnum.Unauthorized) {
      throw new UnauthorizedException();
    }
    const { accessToken, refreshToken } = result.getData();
    if (result.status === ResultStatusEnum.Success) {
      response.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });
      return { accessToken };
    }
  }
  @UseGuards(JwtRefreshTokenGuard)
  @Post(AuthRoutes.logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentDeviceId() deviceId) {
    await this.authService.logout(deviceId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(AuthRoutes.me)
  @HttpCode(HttpStatus.OK)
  async authMe(@CurrentUserId() userId) {
    const result = await this.authService.authMe(userId);
    if (result.status === ResultStatusEnum.NotFound) {
      throw new NotFoundException();
    }
    return result.getData();
  }
}
