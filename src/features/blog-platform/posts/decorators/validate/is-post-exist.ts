import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepo } from '../../infrastructure/posts.repo';

@ValidatorConstraint({ name: 'IsPostExistConstraint', async: true })
@Injectable()
export class IsPostExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly postsRepo: PostsRepo) {}
  async validate(id: string) {
    console.log(id);
    const isExists = await this.postsRepo.existsById(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    return true;
  }
}
export function IsPostExist(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPostExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsPostExistConstraint,
    });
  };
}
