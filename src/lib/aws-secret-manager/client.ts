import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

const REGION = 'ap-southeast-2';
export const client = new SecretsManagerClient({ region: REGION });
