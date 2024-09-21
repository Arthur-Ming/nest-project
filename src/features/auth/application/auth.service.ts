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
import { ObjectId } from 'mongodb';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { CodeRecoveryRepo } from '../infrastructure/code-recovery.repo';
import { NewPasswordDto } from '../api/dto/input/new-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly emailConfirmationRepo: EmailConfirmationRepo,
    private readonly mailerService: MailerService,
    private readonly codeRecoveryRepo: CodeRecoveryRepo,
    private readonly appSettings: AppSettings
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
    const user = await this.usersRepo.findByLoginOrEmail(email);
    if (!user) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }
    const recoveryCode = await this.codeRecoveryRepo.add({
      userId: new ObjectId(user._id),
      createdAt: Number(Date.now()),
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
    await this.emailConfirmationRepo.setConfirmed(confirmCode);
  }
  async registrationEmailResending(email: string) {
    const newConfirmCode = uuidv4();
    const user = await this.usersRepo.findByLoginOrEmail(email);
    if (!user) {
      return null;
    }
    await this.emailConfirmationRepo.updateConfirmationCodeByUserId(
      user._id.toString(),
      newConfirmCode
    );
    this.mailerService
      .sendMail({
        from: `"Arthur 👻" <${this.appSettings.api.EMAIL}>`,
        to: email, // list of receivers
        subject: 'Hello ✔', // Subject line
        html: ` <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${newConfirmCode}'>complete registration</a>
   </p>`,
      })
      .catch(() => {
        console.log('!!');
      });
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

  async newPassword(dto: NewPasswordDto) {
    const recoveryCode = await this.codeRecoveryRepo.findById(dto.recoveryCode);
    if (!recoveryCode) {
      return new InterlayerNotice(ResultStatusEnum.NotFound);
    }
    await this.usersService.updatePassword(recoveryCode.userId.toString(), dto.newPassword);
    return new InterlayerNotice(ResultStatusEnum.Success);
  }
}
