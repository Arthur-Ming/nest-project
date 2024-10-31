import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepo } from '../../infrastructure/blogs.repo';

@ValidatorConstraint({ name: 'IsBlogExistConstraint', async: true })
@Injectable()
export class IsBlogExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogsRepo: BlogsRepo) {}
  async validate(id: string) {
    console.log('validate');
    console.log(id);
    const isExists = await this.blogsRepo.existsById(id);

    if (!isExists) {
      throw new NotFoundException();
    }
    return true;
  }
}
export function IsBlogExist(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsBlogExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsBlogExistConstraint,
    });
  };
}
