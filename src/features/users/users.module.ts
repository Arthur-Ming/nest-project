import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/users.entity';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepo } from './infrastructure/users.repo';
import { UsersQueryRepo } from './infrastructure/users.query-repo';
import { CryptoService } from '../../services/crypto/crypto.service';
import { IsUserExistConstraint } from './decorators/validate/is-user-exist';
import { appSettings, AppSettings } from '../../settings/app-settings';
import { IsUserExistByLoginConstraint } from './decorators/validate/is-user-exist-by-login';
import { IsUserExistByEmailConstraint } from './decorators/validate/is-user-exist-by-email';
import { UsersQueryRepoPg } from './infrastructure/users.query-repo.pg';
import { UsersRepoPg } from './infrastructure/users.repo.pg';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepo,
    UsersQueryRepo,
    UsersQueryRepoPg,
    UsersRepoPg,
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
    UsersRepo,
    UsersQueryRepo,
    IsUserExistConstraint,
    IsUserExistByLoginConstraint,
    IsUserExistByEmailConstraint,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UsersModule {}
