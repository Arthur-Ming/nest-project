import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AppSettings } from '../../settings/app-settings';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private appSettings: AppSettings,
    private readonly jwtService: JwtService
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];

    if (!auth) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = auth.split(' ')[1];

    try {
      this.jwtService.verify(token, {
        secret: this.appSettings.api.JWT_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
