import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppSettings } from '../../../settings/app-settings';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private appSettings: AppSettings) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appSettings.api.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId };
  }
}
