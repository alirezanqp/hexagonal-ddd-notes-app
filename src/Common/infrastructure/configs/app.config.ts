import '../utils/dotenv';

import { get } from 'env-var';

export const appConfig = {
  host: get('HOST').default('localhost').asString(),
  port: get('PORT').default(3000).asPortNumber(),
  env: get('NODE_ENV').default('development').asString(),
  frontBaseUrl: get('FRONT_BASE_URL')
    .default('http://localhost:3000')
    .asString(),
  isProduction:
    get('NODE_ENV').default('development').asString() === 'production',
  isDevelopment:
    get('NODE_ENV').default('development').asString() === 'development',
  isTest: get('NODE_ENV').default('development').asString() === 'test',
};
