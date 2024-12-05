import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/UserAccount/application/ports/token.port';

@Injectable()
export class JwtToken implements Token {
  constructor(private readonly jwtService: JwtService) {}

  async create(payload: string): Promise<string> {
    const payloadAsObject = JSON.parse(payload);
    return this.jwtService.sign(payloadAsObject);
  }

  async verify<T extends object = any>(token: string): Promise<T> {
    return this.jwtService.verify<T>(token);
  }
}
