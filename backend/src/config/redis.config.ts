import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
  keyPrefix: string;
  retryAttempts: number;
  retryDelay: number;
}

export default registerAs(
  'redis',
  (): RedisConfig => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || 'orto_redis_password',
    db: parseInt(process.env.REDIS_DB || '0', 10),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'orto:',
    retryAttempts: 3,
    retryDelay: 3000,
  }),
);
