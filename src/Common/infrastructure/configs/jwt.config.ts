import '../utils/dotenv';

import { get } from 'env-var';

export const jwtConfig = {
  secret: get('JWT_SECRET').required().asString(),
  expiresIn: get('JWT_EXPIRES_IN').default('1d').asString(),
};
