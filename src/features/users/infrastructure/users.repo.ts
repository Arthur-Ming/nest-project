import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/users.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepo {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async add(user: User) {
    const addedUser = await this.userModel.create(user);
    return addedUser._id.toString();
  }

  async remove(userId: string) {
    const deleteResult = await this.userModel.deleteOne({ _id: new ObjectId(userId) });
    return deleteResult.deletedCount === 1;
  }
  existsById(id: string) {
    return this.userModel.exists({ _id: new ObjectId(id) });
  }
  existsByLogin(login: string) {
    return this.userModel.exists({ login });
  }

  existsByEmail(email: string) {
    return this.userModel.exists({ email });
  }
  async findByLoginOrEmail(loginOrEmail: string) {
    const user = await this.userModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    if (!user) return null;
    return user;
  }

  async findById(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;
    return user;
  }

  async updatePassword(userId: string, newPasswordHash: string) {
    const updateResult = await this.userModel.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          password: newPasswordHash,
        },
      }
    );
    return updateResult.matchedCount === 1;
  }
}
