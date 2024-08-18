import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export const ToNumber = () =>
  Transform(({ value }: TransformFnParams) => {
    const num = Number(value);

    if (isNaN(num)) {
      throw new BadRequestException('Not a number');
    }

    return num;
  });
