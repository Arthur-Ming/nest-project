import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/users.entity';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepo } from './infrastructure/users.repo';
import { UsersQueryRepo } from './infrastructure/users.query-repo';
import { CryptoService } from '../../services/crypto/crypto.service';
import { IsUserExistConstraint } from './decorators/validate/is-user-exist';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepo, UsersQueryRepo, CryptoService, IsUserExistConstraint],
})
export class UsersModule {}
