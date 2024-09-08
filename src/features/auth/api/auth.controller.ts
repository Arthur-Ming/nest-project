import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
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

  @Post(AuthRoutes.login)
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto) {
    const result = await this.authService.login(dto);
    if (result.status === ResultStatusEnum.Unauthorized) {
      throw new UnauthorizedException();
    }
    const { accessToken } = result.getData();
    if (result.status === ResultStatusEnum.Success) {
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
