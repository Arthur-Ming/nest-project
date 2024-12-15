import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepo } from './infrastructure/users.repo';
import { UsersQueryRepo } from './infrastructure/users.query-repo';
import { CryptoService } from '../../services/crypto/crypto.service';
import { IsUserExistConstraint } from './decorators/validate/is-user-exist';
import { appSettings, AppSettings } from '../../settings/app-settings';
import { IsUserExistByLoginConstraint } from './decorators/validate/is-user-exist-by-login';
import { IsUserExistByEmailConstraint } from './decorators/validate/is-user-exist-by-email';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepo,
    UsersQueryRepo,
    CryptoService,
    IsUserExistConstraint,
    IsUserExistByLoginConstraint,
    IsUserExistByEmailConstraint,
    {
      provide: AppSettings,
      useValue: appSettings,
    },
  ],
  exports: [
    UsersService,
    UsersQueryRepo,
    IsUserExistConstraint,
    IsUserExistByLoginConstraint,
    IsUserExistByEmailConstraint,
  ],
})
export class UsersModule {}
