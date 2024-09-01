import { Injectable, PipeTransform } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DecodeJwtTokenPipe implements PipeTransform {
  constructor(private readonly jwtService: JwtService) {}

  public async transform(token: any) {
    return this.jwtService.decode(token);
  }
}
