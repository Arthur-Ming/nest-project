import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepo } from '../../infrastructure/pg/comments.repo';

@ValidatorConstraint({ name: 'IsCommentExistConstraint', async: true })
@Injectable()
export class IsCommentExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly commentsRepo: CommentsRepo) {}
  async validate(id: string) {
    const isExists = await this.commentsRepo.existsById(id);

    if (!isExists) {
      throw new NotFoundException();
    }
    return true;
  }
}
export function IsCommentExist(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCommentExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsCommentExistConstraint,
    });
  };
}
