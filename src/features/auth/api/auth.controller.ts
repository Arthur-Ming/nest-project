import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthRoutes } from '../routes/auth-routes';
import { CreateUserDto } from '../../users/api/dto/input/create-user.dto';
import { AuthService } from '../application/auth.service';
import { SkipThrottle } from '@nestjs/throttler';

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
}
