import { registerAs } from '@nestjs/config';

export interface InfluxDbConfig {
  url: string;
  token: string;
  org: string;
  bucket: string;
  timeout: number;
}

export default registerAs(
  'influxdb',
  (): InfluxDbConfig => ({
    url: process.env.INFLUXDB_URL || 'http://localhost:8086',
    token: process.env.INFLUXDB_TOKEN || 'orto_admin_token_change_in_production',
    org: process.env.INFLUXDB_ORG || 'orto',
    bucket: process.env.INFLUXDB_BUCKET || 'sensor_data',
    timeout: parseInt(process.env.INFLUXDB_TIMEOUT || '30000', 10),
  }),
);
