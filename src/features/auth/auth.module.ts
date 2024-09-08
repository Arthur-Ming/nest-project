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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: EmailConfirmation.name, schema: EmailConfirmationSchema }]),
    JwtModule.register({}),
    UsersModule,
    MailAdapterModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CryptoService,
    EmailConfirmationRepo,
    {
      provide: AppSettings,
      useValue: appSettings,
    },
  ],
})
export class AuthModule {}
