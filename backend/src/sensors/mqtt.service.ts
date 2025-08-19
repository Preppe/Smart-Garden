import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, MqttClient, IClientOptions } from 'mqtt';
import { MqttConfig } from '../config/mqtt.config';
import { InfluxDbService } from './influxdb.service';

export interface MqttSensorData {
  sensorId: string;
  userId: string;
  value: number;
  timestamp?: string;
  token: string;
}

export interface MqttCommand {
  command: string;
  parameters?: Record<string, any>;
  timestamp: string;
}

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private client: MqttClient;
  private config: MqttConfig;
  private readonly connectedTokens = new Set<string>();

  constructor(
    private configService: ConfigService,
    private influxDbService: InfluxDbService,
  ) {
    this.config = this.configService.get<MqttConfig>('mqtt')!;
  }

  onModuleInit() {
    this.logger.log('Initializing MQTT connection...');

    const options: IClientOptions = {
      host: this.config.host,
      port: this.config.port,
      clientId: this.config.clientId,
      username: this.config.username,
      password: this.config.password,
      keepalive: this.config.keepalive,
      reconnectPeriod: this.config.reconnectPeriod,
      connectTimeout: this.config.connectTimeout,
      clean: true,
    };

    this.client = connect(options);

    this.client.on('connect', () => {
      this.logger.log('Connected to MQTT broker');
      this.subscribeToSensorData();
    });

    this.client.on('error', (error) => {
      this.logger.error(`MQTT connection error: ${error.message}`, error.stack);
    });

    this.client.on('reconnect', () => {
      this.logger.log('Reconnecting to MQTT broker...');
    });

    this.client.on('offline', () => {
      this.logger.warn('MQTT client is offline');
    });

    this.client.on('message', (topic, message) => {
      this.handleIncomingMessage(topic, message);
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end();
    }
    this.logger.log('MQTT connection closed');
  }

  private subscribeToSensorData() {
    // Subscribe to all sensor data topics: orto/+/+/data
    const dataTopicPattern = 'orto/+/+/data';

    this.client.subscribe(dataTopicPattern, { qos: 1 }, (error) => {
      if (error) {
        this.logger.error(`Failed to subscribe to ${dataTopicPattern}: ${error.message}`);
      } else {
        this.logger.log(`Subscribed to sensor data topic: ${dataTopicPattern}`);
      }
    });

    // Subscribe to device status topics
    const statusTopicPattern = 'orto/+/+/status';

    this.client.subscribe(statusTopicPattern, { qos: 1 }, (error) => {
      if (error) {
        this.logger.error(`Failed to subscribe to ${statusTopicPattern}: ${error.message}`);
      } else {
        this.logger.log(`Subscribed to device status topic: ${statusTopicPattern}`);
      }
    });
  }

  private async handleIncomingMessage(topic: string, message: Buffer) {
    try {
      const messageStr = message.toString();
      this.logger.debug(`Received message on topic ${topic}: ${messageStr}`);

      // Parse topic: orto/{userId}/{sensorId}/{type}
      const topicParts = topic.split('/');
      if (topicParts.length !== 4 || topicParts[0] !== 'orto') {
        this.logger.warn(`Invalid topic format: ${topic}`);
        return;
      }

      const [, userId, sensorId, messageType] = topicParts;

      if (messageType === 'data') {
        await this.handleSensorData(userId, sensorId, messageStr);
      } else if (messageType === 'status') {
        await this.handleDeviceStatus(userId, sensorId, messageStr);
      }
    } catch (error) {
      this.logger.error(`Error handling MQTT message: ${error.message}`, error.stack);
    }
  }

  private async handleSensorData(userId: string, sensorId: string, messageStr: string) {
    try {
      const data: MqttSensorData = JSON.parse(messageStr);

      // Validate token and required fields
      if (!data.token || !this.isValidToken(sensorId, data.token)) {
        this.logger.warn(`Invalid or missing token for sensor ${sensorId}`);
        return;
      }

      if (typeof data.value !== 'number') {
        this.logger.warn(`Invalid value for sensor ${sensorId}: ${data.value}`);
        return;
      }

      // Store data in InfluxDB
      await this.influxDbService.writeSensorData({
        sensorId,
        userId,
        value: data.value,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      });

      this.logger.debug(`Stored sensor data for ${sensorId}: ${data.value}`);
    } catch (error) {
      this.logger.error(`Error processing sensor data: ${error.message}`, error.stack);
    }
  }

  private async handleDeviceStatus(userId: string, sensorId: string, messageStr: string) {
    try {
      const status = JSON.parse(messageStr);
      this.logger.debug(`Device status for ${sensorId}:`, status);

      // Here you could update device status in the database
      // For now, we just log it
    } catch (error) {
      this.logger.error(`Error processing device status: ${error.message}`, error.stack);
    }
  }

  async sendCommand(userId: string, sensorId: string, command: MqttCommand): Promise<void> {
    try {
      const topic = `orto/${userId}/${sensorId}/command`;
      const message = JSON.stringify(command);

      return new Promise((resolve, reject) => {
        this.client.publish(topic, message, { qos: 1 }, (error) => {
          if (error) {
            this.logger.error(`Failed to send command to ${sensorId}: ${error.message}`);
            reject(error);
          } else {
            this.logger.debug(`Command sent to ${sensorId}: ${command.command}`);
            resolve();
          }
        });
      });
    } catch (error) {
      this.logger.error(`Error sending MQTT command: ${error.message}`, error.stack);
      throw error;
    }
  }

  generateSensorTopic(userId: string, sensorId: string): string {
    return `orto/${userId}/${sensorId}`;
  }

  getMqttConnectionInfo(userId: string, sensorId: string, token: string) {
    return {
      host: this.config.host,
      port: this.config.port,
      wsPort: this.config.wsPort,
      dataTopicPublish: `orto/${userId}/${sensorId}/data`,
      commandTopicSubscribe: `orto/${userId}/${sensorId}/command`,
      statusTopicPublish: `orto/${userId}/${sensorId}/status`,
      token,
      keepalive: this.config.keepalive,
      clientIdPrefix: `sensor_${sensorId}_`,
    };
  }

  private isValidToken(sensorId: string, token: string): boolean {
    // This should validate the token against the sensor's stored token
    // For now, we'll implement a basic check - in a real implementation,
    // you'd check against the database
    return Boolean(token && token.length > 10);
  }

  registerValidToken(token: string): void {
    this.connectedTokens.add(token);
  }

  unregisterToken(token: string): void {
    this.connectedTokens.delete(token);
  }
}
