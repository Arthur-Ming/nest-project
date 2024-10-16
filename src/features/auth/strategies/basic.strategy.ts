import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AppSettings } from '../../../settings/app-settings';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private appSettings: AppSettings) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password): Promise<boolean> => {
    if (
      this.appSettings.api.ADMIN_LOGIN === username &&
      this.appSettings.api.ADMIN_PASSWORD === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
