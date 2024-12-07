import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export interface UserTokenData {
  id: string;
  email: string;
}

export const UserData = createParamDecorator(
  (data: keyof UserTokenData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      throw new Error(
        '@UserData has been used while there is no user in the request. Maybe an auth decorator has not been used in the route',
      );
    }

    return data ? request.user[data] : request.user;
  },
);
