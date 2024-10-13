import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsRepo } from '../../infrastructure/blogs.repo';

@ValidatorConstraint({ name: 'IsBlogByIdExistConstraint', async: true })
@Injectable()
export class IsBlogByIdExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogsRepo: BlogsRepo) {}
  async validate(id: string) {
    const isExists = await this.blogsRepo.existsById(id);

    return Boolean(isExists);
  }
}
export function IsBlogByIdExist(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsBlogByIdExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsBlogByIdExistConstraint,
    });
  };
}
