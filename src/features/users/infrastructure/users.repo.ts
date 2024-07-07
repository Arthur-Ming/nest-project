import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/users.entity';
import { AddUserDto } from '../application/dto/add-user.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepo {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async add(addUserDTO: AddUserDto) {
    const addedUser = await this.userModel.create(addUserDTO);
    return addedUser;
  }

  async remove(userId: string) {
    const deleteResult = await this.userModel.deleteOne({ _id: new ObjectId(userId) });
    return deleteResult.deletedCount === 1;
  }
}
