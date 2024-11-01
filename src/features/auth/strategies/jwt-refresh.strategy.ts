import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AppSettings } from '../../../settings/app-settings';
import { Request as RequestType } from 'express';
import { SessionRepo } from '../infrastructure/session.repo';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private appSettings: AppSettings,
    private readonly sessionRepo: SessionRepo
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtRefreshStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: appSettings.api.JWT_SECRET,
    });
  }
  private static extractJWT(req: RequestType): string | null {
    if (req.cookies && 'refreshToken' in req.cookies && req.cookies.refreshToken.length > 0) {
      return req.cookies.refreshToken;
    }

    return null;
  }

  async validate(payload: any) {
    const session = await this.sessionRepo.findById(payload.deviceId);
    console.log('validate');
    console.log(session);
    if (!session) {
      throw new UnauthorizedException();
    }
    if (Number(session.exp) !== Number(payload.exp)) {
      throw new UnauthorizedException();
    }
    return { deviceId: payload.deviceId };
  }
}
