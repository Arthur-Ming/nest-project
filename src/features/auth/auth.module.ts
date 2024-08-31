import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/users.entity';
import { CryptoService } from '../../services/crypto/crypto.service';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, CryptoService],
})
export class AuthModule {}
