import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { CreateUserDto } from '../../users/api/dto/input/create-user.dto';
import { LoginUserDto } from '../api/dto/input/login-user.dto';
import { UsersRepo } from '../../users/infrastructure/users.repo';
import { CryptoService } from '../../../services/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { AppSettings, appSettings } from '../../../settings/app-settings';
import { InterlayerNotice } from '../../../base/result/result';
import { ResultStatusEnum } from '../../../base/result/result-status.enum';
import { AuthMeDto } from '../api/dto/output/auth-me.dto';
import { EmailConfirmationRepo } from '../infrastructure/email-confirmation.repo';
import { add } from 'date-fns';
import { MailerService } from '@nestjs-modules/mailer';
import { CodeRecoveryRepo } from '../infrastructure/code-recovery.repo';
import { NewPasswordDto } from '../api/dto/input/new-password.dto';
import { SessionRepo } from '../infrastructure/session.repo';
import { LoginMetadataDto } from '../api/dto/input/login-metadata.dto';
import { EmailConfirmationRepoPg } from '../infrastructure/email-confirmation.repo.pg';
import { UsersRepoPg } from '../../users/infrastructure/users.repo.pg';
import { CodeRecoveryRepoPg } from '../infrastructure/code-recovery.repo.pg';
import { SessionRepoPg } from '../infrastructure/session.repo.pg';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepo: UsersRepo,
    private readonly usersRepoPg: UsersRepoPg,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly emailConfirmationRepo: EmailConfirmationRepo,
    private readonly emailConfirmationRepoPg: EmailConfirmationRepoPg,
    private readonly mailerService: MailerService,
    private readonly codeRecoveryRepo: CodeRecoveryRepo,
    private readonly codeRecoveryRepoPg: CodeRecoveryRepoPg,
    private readonly sessionRepo: SessionRepo,
    private readonly sessionRepoPg: SessionRepoPg,
    private readonly appSettings: AppSettings
  ) {}
  async registration(dto: CreateUserDto) {
    const userId = await this.usersService.addUser(dto);

    const expirationDate = Number(
      add(new Date(), {
        minutes: 30,
      })
    );

    const id = await this.emailConfirmationRepoPg.add({
      userId: userId.toString(),
      exp: expirationDate,
      isConfirmed: false,
    });

    const confirmationCode = id;

    this.mailerService
      .sendMail({
        from: `"Arthur 👻" <${this.appSettings.api.EMAIL}>`,
        to: dto.email, // list of receivers
        subject: 'Hello ✔', // Subject line
        html: ` <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
   </p>`,
      })
      .catch(() => {
        console.log('!!');
      });
  }

  async passwordRecovery(email: string) {
    const user = await this.usersRepoPg.findByLoginOrEmail(email);
    if (!user) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }
    const recoveryCode = await this.codeRecoveryRepoPg.add({
      userId: user.id,
    });
    this.mailerService
      .sendMail({
        from: `"Arthur 👻" <${this.appSettings.api.EMAIL}>`,
        to: email, // list of receivers
        subject: 'Hello ✔', // Subject line
        html: `<h1>Password recovery</h1>
    <p>To finish password recovery please follow the link below:
    <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
     
  </p>`,
      })
      .catch(() => {
        console.log('!!');
      });
    return new InterlayerNotice(ResultStatusEnum.Success);
  }
  async registrationConfirmation(confirmCode: string) {
    const confirmation = await this.emailConfirmationRepoPg.findByConfirmationCode(confirmCode);
    await this.emailConfirmationRepoPg.setConfirmedByUserId(confirmation.userId);
  }
  async registrationEmailResending(email: string) {
    const user = await this.usersRepoPg.findByEmail(email);
    if (!user) {
      return null;
    }
    const expirationDate = Number(
      add(new Date(), {
        minutes: 30,
      })
    );

    const id = await this.emailConfirmationRepoPg.add({
      userId: user.id.toString(),
      exp: expirationDate,
      isConfirmed: false,
    });

    const confirmationCode = id;

    this.mailerService
      .sendMail({
        from: `"Arthur 👻" <${this.appSettings.api.EMAIL}>`,
        to: email, // list of receivers
        subject: 'Hello ✔', // Subject line
        html: ` <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
   </p>`,
      })
      .catch(() => {
        console.log('!!');
      });
  }

  async validateUser(loginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersRepoPg.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    const isPasswordCompare = await this.cryptoService.compare(password, user.password);

    if (!isPasswordCompare) {
      return null;
    }

    return user;
  }
  async login(loginUserDto: LoginUserDto, loginMetadataDto: LoginMetadataDto) {
    const user = await this.usersRepoPg.findById(loginMetadataDto.userId);
    if (!user) {
      return new InterlayerNotice(ResultStatusEnum.Unauthorized, null);
    }

    const accessTokenPayload = { userId: loginMetadataDto.userId };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      secret: appSettings.api.JWT_SECRET,
      expiresIn: appSettings.api.ACCESS_TOKEN_EXPIRES_IN,
    });

    const sessionId = await this.sessionRepoPg.add({
      ip: loginMetadataDto.ip,
      iat: 0,
      exp: 0,
      userId: user.id,
      deviceName: loginMetadataDto.deviceName,
    });
    const refreshToken = await this.jwtService.signAsync(
      { deviceId: sessionId },
      {
        secret: appSettings.api.JWT_SECRET,
        expiresIn: appSettings.api.REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    const d = this.jwtService.decode(refreshToken);

    await this.sessionRepoPg.update(sessionId, { iat: d.iat, exp: d.exp });

    return new InterlayerNotice(ResultStatusEnum.Success, { accessToken, refreshToken });
  }

  async logout(deviceId: string) {
    await this.sessionRepoPg.remove(deviceId);
  }
  async refreshToken(deviceId: string) {
    const session = await this.sessionRepoPg.findById(deviceId);
    if (!session) {
      return new InterlayerNotice(ResultStatusEnum.Unauthorized, null);
    }
    const accessTokenPayload = { userId: session.userId };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      secret: appSettings.api.JWT_SECRET,
      expiresIn: appSettings.api.ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = await this.jwtService.signAsync(
      { deviceId },
      {
        secret: appSettings.api.JWT_SECRET,
        expiresIn: appSettings.api.REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    const d = this.jwtService.decode(refreshToken);

    await this.sessionRepoPg.update(deviceId, { iat: d.iat, exp: d.exp });

    return new InterlayerNotice(ResultStatusEnum.Success, { accessToken, refreshToken });
  }
  async authMe(userId) {
    const user = await this.usersRepoPg.findById(userId);
    if (!user) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }

    return new InterlayerNotice<AuthMeDto>(ResultStatusEnum.Success, {
      userId,
      email: user.email,
      login: user.login,
    });
  }

  async newPassword(dto: NewPasswordDto) {
    const recoveryCode = await this.codeRecoveryRepoPg.findById(dto.recoveryCode);
    console.log(recoveryCode);
    if (!recoveryCode) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }
    await this.usersService.updatePassword(recoveryCode.userId.toString(), dto.newPassword);
    return new InterlayerNotice(ResultStatusEnum.Success);
  }
}
