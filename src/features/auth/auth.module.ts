import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/users.entity';
import { CryptoService } from '../../services/crypto/crypto.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { appSettings, AppSettings } from '../../settings/app-settings';
import { MailAdapterModule } from '../../common/adapters/mail-adapter/mail-adapter.module';
import { EmailConfirmationRepo } from './infrastructure/email-confirmation.repo';
import { EmailConfirmation, EmailConfirmationSchema } from './domain/email-confirmation.entity';
import { ConfirmCodeValidateConstraint } from './decorators/validate/confirm-code.validate';
import { IsConfirmExistByEmailConstraint } from './decorators/validate/is-confirm-exist-by-email';
import { CodeRecovery, CodeRecoverySchema } from './domain/code-recovery.entity';

import { CodeRecoveryRepo } from './infrastructure/code-recovery.repo';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BasicStrategy } from './strategies/basic.strategy';
import { SessionRepo } from './infrastructure/session.repo';
import { SessionSchema, Session } from './domain/session.entity';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { SecurityDevicesController } from './api/security-devices.controller';
import { SessionQueryRepo } from './infrastructure/session.query.repo';
import { SecurityDevicesService } from './application/security-devices.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: EmailConfirmation.name, schema: EmailConfirmationSchema }]),
    MongooseModule.forFeature([{ name: CodeRecovery.name, schema: CodeRecoverySchema }]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    JwtModule.register({}),
    UsersModule,
    MailAdapterModule,
    PassportModule,
  ],
  controllers: [AuthController, SecurityDevicesController],
  providers: [
    AuthService,
    CryptoService,
    SecurityDevicesService,
    EmailConfirmationRepo,
    CodeRecoveryRepo,
    SessionRepo,
    SessionQueryRepo,
    ConfirmCodeValidateConstraint,
    IsConfirmExistByEmailConstraint,
    {
      provide: AppSettings,
      useValue: appSettings,
    },
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    BasicStrategy,
  ],
  exports: [
    AuthService,
    JwtModule.register({}),
    {
      provide: AppSettings,
      useValue: appSettings,
    },
  ],
})
export class AuthModule {}
