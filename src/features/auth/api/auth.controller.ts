import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRoutes } from '../routes/auth-routes';
import { CreateUserDto } from '../../users/api/dto/input/create-user.dto';
import { AuthService } from '../application/auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { LoginUserDto } from './dto/input/login-user.dto';
import { ResultStatusEnum } from '../../../base/result/result-status.enum';

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
}
