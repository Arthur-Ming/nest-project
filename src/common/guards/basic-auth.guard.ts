import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppSettings } from '../../settings/app-settings';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private appSettings: AppSettings) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const auth = request.headers['authorization'];

    if (!auth) {
      throw new UnauthorizedException('Unauthorized');
    }

    const credentials = `${this.appSettings.api.ADMIN_LOGIN}:${this.appSettings.api.ADMIN_PASSWORD}`;
    if ('Basic ' + btoa(credentials) !== auth) {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
