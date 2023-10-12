import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

import { client } from './client';

import logger from '@/logger';

export const getSecretKeys = async (secretName: string) => {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);

    const secret = response.SecretString;

    if (!secret) {
      throw new Error('Secret not found');
    }

    const secretObject = JSON.parse(secret);

    return secretObject;
  } catch (err) {
    logger.error('Error retrieving secret:', err);
    throw err;
  }
};
