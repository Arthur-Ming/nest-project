import { registerDecorator, ValidationOptions } from 'class-validator';
import { LikesStatusEnum } from '../../enum/likes-status.enum';

export function IsLikeStatus(property?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsLikeStatus',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        ...validationOptions,
        message: 'LikeStatus is not valid',
      },
      validator: {
        validate(value: any) {
          const s = LikesStatusEnum.hasOwnProperty(value);
          if (!s) {
            return false;
          }
          return s;
        },
      },
    });
  };
}
