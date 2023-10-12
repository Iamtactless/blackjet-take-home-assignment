import {
  GetSecretValueCommand,
  ListSecretVersionIdsCommand,
} from '@aws-sdk/client-secrets-manager';

import { client } from './client';

import logger from '@/logger';

export const getAllSecretKeys = async (secretName: string) => {
  try {
    const command = new ListSecretVersionIdsCommand({ SecretId: secretName });
    const response = await client.send(command);

    const secrets = [];
    for (const version of response.Versions ?? []) {
      const versionCommand = new GetSecretValueCommand({
        SecretId: secretName,
        VersionId: version.VersionId,
      });
      const data = await client.send(versionCommand);
      if (!data.SecretString) {
        throw new Error('Secret not found');
      }
      const secretObject = JSON.parse(data.SecretString);
      secrets.push({ ...secretObject, ...version });
    }
    return secrets;
  } catch (err) {
    logger.error('Error retrieving secret:', err);
    throw err;
  }
};
