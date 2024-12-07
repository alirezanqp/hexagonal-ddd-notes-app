import { ExceptionBase } from '@common/domain/exception/exceptions.base';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const rawToken =
      request.headers.authorization?.split(/\s+/g)[1] ??
      (request.query.token as string);

    if (!rawToken) throw new UnauthorizedException();

    try {
      const tokenData = await this.jwtService.verify(rawToken);

      request.user = tokenData;
      return true;
    } catch (err) {
      if (err instanceof ExceptionBase) throw err;
      throw new UnauthorizedException();
    }
  }
}
