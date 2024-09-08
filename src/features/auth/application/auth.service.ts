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
import { AuthMeDto } from '../api/dto/output/auth-me.dto';
import { MailAdapter } from '../../../common/adapters/mail-adapter/mail.adapter';
import { EmailConfirmationRepo } from '../infrastructure/email-confirmation.repo';
import { ObjectId } from 'mongodb';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly mailAdapter: MailAdapter,
    private readonly emailConfirmationRepo: EmailConfirmationRepo
  ) {}
  async registration(dto: CreateUserDto) {
    const userId = await this.usersService.addUser(dto);
    const confirmationCode = uuidv4();
    const expirationDate = Number(
      add(new Date(), {
        minutes: 30,
      })
    );

    await this.emailConfirmationRepo.add({
      userId: new ObjectId(userId),
      confirmationCode,
      expirationDate,
      isConfirmed: false,
    });

    this.mailAdapter.sendMail([dto.email], confirmationCode);
  }

  async registrationConfirmation(confirmCode: string) {
    await this.emailConfirmationRepo.setConfirmed(confirmCode);
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

  async authMe(userId) {
    const user = await this.usersRepo.findById(userId);
    if (!user) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }

    return new InterlayerNotice<AuthMeDto>(ResultStatusEnum.Success, {
      userId,
      email: user.email,
      login: user.login,
    });
  }
}
