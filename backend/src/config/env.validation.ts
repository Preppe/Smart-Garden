import { plainToClass, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number = 3000;

  // Database Configuration
  @IsString()
  POSTGRES_HOST: string = 'localhost';

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  POSTGRES_PORT: number = 5432;

  @IsString()
  POSTGRES_USER: string = 'orto_user';

  @IsString()
  POSTGRES_PASSWORD: string = 'orto_password';

  @IsString()
  POSTGRES_DB: string = 'orto_db';

  // Redis Configuration
  @IsString()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  REDIS_PORT: number = 6379;

  @IsString()
  REDIS_PASSWORD: string = 'orto_redis_password';

  // MQTT Configuration
  @IsString()
  MQTT_HOST: string = 'localhost';

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  MQTT_PORT: number = 1883;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  MQTT_WS_PORT: number = 9001;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
