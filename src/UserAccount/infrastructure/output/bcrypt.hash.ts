import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Hash } from 'src/UserAccount/application/ports/hash.port';

@Injectable()
export class BcryptHash implements Hash {
  async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(data, salt);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
