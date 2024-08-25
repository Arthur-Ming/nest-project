import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { UsersService } from '../users/application/users.service';
import { UsersRepo } from '../users/infrastructure/users.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/users.entity';
import { UsersQueryRepo } from '../users/infrastructure/users.query-repo';
import { CryptoService } from '../../services/crypto/crypto.service';
import { IsUserExistConstraint } from '../users/decorators/validate/is-user-exist';
import { appSettings, AppSettings } from '../../settings/app-settings';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersRepo,
    UsersQueryRepo,
    CryptoService,
    IsUserExistConstraint,
    {
      provide: AppSettings,
      useValue: appSettings,
    },
  ],
})
export class AuthModule {}
