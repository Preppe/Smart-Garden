import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'orto_user',
    password: process.env.POSTGRES_PASSWORD || 'orto_password',
    database: process.env.POSTGRES_DB || 'orto_db',

    // Development settings
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],

    // Entity auto-loading (when entities are created)
    autoLoadEntities: true,

    // Migration settings
    migrationsRun: process.env.NODE_ENV !== 'development',
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'orto_migrations',

    // Connection health
    retryAttempts: 3,
    retryDelay: 3000,
  }),
);
