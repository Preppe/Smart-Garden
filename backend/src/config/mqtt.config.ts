import { registerAs } from '@nestjs/config';

export interface MqttConfig {
  host: string;
  port: number;
  wsPort: number;
  clientId: string;
  username?: string;
  password?: string;
  keepalive: number;
  reconnectPeriod: number;
  connectTimeout: number;
  topics: {
    sensorData: string;
    deviceStatus: string;
    automation: string;
  };
}

export default registerAs(
  'mqtt',
  (): MqttConfig => ({
    host: process.env.MQTT_HOST || 'localhost',
    port: parseInt(process.env.MQTT_PORT || '1883', 10),
    wsPort: parseInt(process.env.MQTT_WS_PORT || '9001', 10),
    clientId: process.env.MQTT_CLIENT_ID || `smartgarden_backend_${Math.random().toString(16).substr(2, 8)}`,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    keepalive: 60,
    reconnectPeriod: 1000,
    connectTimeout: 30000,
    topics: {
      sensorData: process.env.MQTT_TOPIC_SENSOR_DATA || 'smartgarden/+/+/data',
      deviceStatus: process.env.MQTT_TOPIC_DEVICE_STATUS || 'smartgarden/+/+/status',
      automation: process.env.MQTT_TOPIC_AUTOMATION || 'smartgarden/+/automation/+',
    },
  }),
);
