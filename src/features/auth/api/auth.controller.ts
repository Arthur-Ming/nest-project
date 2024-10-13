import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { AccessTokenPayloadDto } from './dto/output/access-token-payload.dto';
import { ExtractAccessToken } from '../decorators/extract-access-token';
import { DecodeJwtTokenPipe } from '../pipes/decode-jwt-token.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ConfirmDto } from './dto/input/confirm.dto';
import { RegistrationEmailResendingDto } from './dto/input/registration-email-resending.dto';
import { PasswordRecoveryDto } from './dto/input/password-recovery.dto';
import { NewPasswordDto } from './dto/input/new-password.dto';
import { Response } from 'express';

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
  @Post(AuthRoutes.login)
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(dto);
    if (result.status === ResultStatusEnum.Unauthorized) {
      throw new UnauthorizedException();
    }
    const { accessToken, refreshToken } = result.getData();
    if (result.status === ResultStatusEnum.Success) {
      response.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
      return { accessToken };
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get(AuthRoutes.me)
  @HttpCode(HttpStatus.OK)
  async authMe(@ExtractAccessToken(DecodeJwtTokenPipe) payload: AccessTokenPayloadDto) {
    const result = await this.authService.authMe(payload.userId);
    if (result.status === ResultStatusEnum.NotFound) {
      throw new NotFoundException();
    }
    return result.getData();
  }
}
