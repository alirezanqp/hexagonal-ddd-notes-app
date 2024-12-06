import '../utils/dotenv';

import { get } from 'env-var';

export const redisConfig = {
  host: get('REDIS_HOST').default('localhost').asString(),
  port: get('REDIS_PORT').default(6379).asIntPositive(),
  password: get('REDIS_PASSWORD').asString(),
  db: get('REDIS_DB').default(0).asInt(),
};
