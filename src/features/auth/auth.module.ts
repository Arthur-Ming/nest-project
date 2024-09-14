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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: EmailConfirmation.name, schema: EmailConfirmationSchema }]),
    MongooseModule.forFeature([{ name: CodeRecovery.name, schema: CodeRecoverySchema }]),
    JwtModule.register({}),
    UsersModule,
    MailAdapterModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CryptoService,
    EmailConfirmationRepo,
    CodeRecoveryRepo,
    ConfirmCodeValidateConstraint,
    IsConfirmExistByEmailConstraint,
    {
      provide: AppSettings,
      useValue: appSettings,
    },
  ],
})
export class AuthModule {}
