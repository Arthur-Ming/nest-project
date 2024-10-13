import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractAccessToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const auth = request.headers['authorization'];
  if (!auth) {
    return null;
  }
  return auth.split(' ')[1];
});
