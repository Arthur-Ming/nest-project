import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { CreateUserDto } from '../../users/api/dto/input/create-user.dto';
import { LoginUserDto } from '../api/dto/input/login-user.dto';
import { UsersRepo } from '../../users/infrastructure/users.repo';
import { CryptoService } from '../../../services/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { appSettings } from '../../../settings/app-settings';
import { InterlayerNotice } from '../../../base/result/result';
import { ResultStatusEnum } from '../../../base/result/result-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService
  ) {}
  async registration(dto: CreateUserDto) {
    await this.usersService.addUser(dto);
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersRepo.findByLoginOrEmail(dto.loginOrEmail);
    if (!user) {
      return new InterlayerNotice(ResultStatusEnum.Unauthorized, null);
    }
    const isPasswordCompare = await this.cryptoService.compare(dto.password, user.password);
    if (!isPasswordCompare) {
      return new InterlayerNotice(ResultStatusEnum.Unauthorized, null);
    }
    const accessTokenPayload = { userId: user._id.toString() };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      secret: appSettings.api.JWT_SECRET,
      expiresIn: appSettings.api.ACCESS_TOKEN_EXPIRES_IN,
    });
    return new InterlayerNotice(ResultStatusEnum.Success, { accessToken });
  }
}
