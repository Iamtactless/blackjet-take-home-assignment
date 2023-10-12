import { getSecretKeys } from './get-secret-keys';

import { env } from '@/config';
import logger from '@/logger';

export const fetchDbConfig = async () => {
  try {
    const [mongoSecret, pmongoSecret] = await Promise.all([
      getSecretKeys(env.MONGO_SECRET_KEY),
      getSecretKeys(env.PMONGO_SECRET_KEY),
    ]);

    return {
      mongo: {
        username: mongoSecret.username,
        password: mongoSecret.password,
        ip: mongoSecret.ip,
        database: mongoSecret.database,
      },
      pmongo: {
        username: pmongoSecret.username,
        password: pmongoSecret.password,
        ip: pmongoSecret.public_ip,
        database: pmongoSecret.db_name,
        INTERNALDNS: pmongoSecret.internal_dns,
      },
    };
  } catch (error) {
    logger.error('Error fetching configuration:', error);
    throw error;
  }
};
