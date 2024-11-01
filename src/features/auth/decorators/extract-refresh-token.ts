import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractRefreshToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request?.cookies?.refreshToken || null;
});
