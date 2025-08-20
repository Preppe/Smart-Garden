import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InfluxDB, Point, WriteApi, QueryApi } from '@influxdata/influxdb-client';
import { InfluxDbConfig } from '../config/influxdb.config';

export interface SensorDataPoint {
  sensorId: string;
  userId: string;
  value: number;
  timestamp?: number;
}

export interface SensorDataQuery {
  sensorId: string;
  userId: string;
  start: string; // RFC3339 timestamp
  stop?: string; // RFC3339 timestamp
  aggregateWindow?: string; // e.g., '1m', '5m', '1h'
}

@Injectable()
export class InfluxDbService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(InfluxDbService.name);
  private client: InfluxDB;
  private writeApi: WriteApi;
  private queryApi: QueryApi;
  private config: InfluxDbConfig;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<InfluxDbConfig>('influxdb')!;
  }

  onModuleInit() {
    this.logger.log('Initializing InfluxDB connection...');

    this.client = new InfluxDB({
      url: this.config.url,
      token: this.config.token,
      timeout: this.config.timeout,
    });

    this.writeApi = this.client.getWriteApi(this.config.org, this.config.bucket);
    this.writeApi.useDefaultTags({ application: 'smart-garden' });

    this.queryApi = this.client.getQueryApi(this.config.org);

    this.logger.log('InfluxDB connection initialized');
  }

  async onModuleDestroy() {
    if (this.writeApi) {
      await this.writeApi.close();
    }
    this.logger.log('InfluxDB connection closed');
  }

  async writeSensorData(data: SensorDataPoint): Promise<void> {
    try {
      // Convert Unix timestamp to nanoseconds for InfluxDB
      const timestamp = data.timestamp 
        ? new Date(data.timestamp * 1000) // Convert seconds to milliseconds for Date constructor
        : new Date();

      const point = new Point('sensor_data')
        .tag('sensor_id', data.sensorId)
        .tag('user_id', data.userId)
        .floatField('value', data.value)
        .timestamp(timestamp);

      this.writeApi.writePoint(point);
      await this.writeApi.flush();

      this.logger.debug(`Written data point for sensor ${data.sensorId}: ${data.value}`);
    } catch (error) {
      this.logger.error(`Failed to write sensor data: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getSensorData(query: SensorDataQuery): Promise<any[]> {
    try {
      const fluxQuery = `
        from(bucket: "${this.config.bucket}")
          |> range(start: ${query.start}${query.stop ? `, stop: ${query.stop}` : ''})
          |> filter(fn: (r) => r["_measurement"] == "sensor_data")
          |> filter(fn: (r) => r["sensor_id"] == "${query.sensorId}")
          |> filter(fn: (r) => r["user_id"] == "${query.userId}")
          |> filter(fn: (r) => r["_field"] == "value")
          ${query.aggregateWindow ? `|> aggregateWindow(every: ${query.aggregateWindow}, fn: mean, createEmpty: false)` : ''}
          |> yield(name: "sensor_data")
      `;

      const result: any[] = [];
      return new Promise((resolve, reject) => {
        this.queryApi.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const o = tableMeta.toObject(row);
            result.push({
              time: Math.floor(new Date(o._time).getTime() / 1000), // Convert to Unix timestamp in seconds
              value: o._value,
              sensorId: o.sensor_id,
              userId: o.user_id,
            });
          },
          error: (error) => {
            this.logger.error(`Query failed: ${error.message}`, error.stack);
            reject(error);
          },
          complete: () => {
            this.logger.debug(`Query completed, returned ${result.length} points`);
            resolve(result);
          },
        });
      });
    } catch (error) {
      this.logger.error(`Failed to query sensor data: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getLatestSensorValue(sensorId: string, userId: string): Promise<any | null> {
    try {
      const fluxQuery = `
        from(bucket: "${this.config.bucket}")
          |> range(start: -1h)
          |> filter(fn: (r) => r["_measurement"] == "sensor_data")
          |> filter(fn: (r) => r["sensor_id"] == "${sensorId}")
          |> filter(fn: (r) => r["user_id"] == "${userId}")
          |> filter(fn: (r) => r["_field"] == "value")
          |> last()
          |> yield(name: "latest_value")
      `;

      const result: any[] = [];
      return new Promise((resolve, reject) => {
        this.queryApi.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const o = tableMeta.toObject(row);
            result.push({
              time: Math.floor(new Date(o._time).getTime() / 1000), // Convert to Unix timestamp in seconds
              value: o._value,
              sensorId: o.sensor_id,
              userId: o.user_id,
            });
          },
          error: (error) => {
            this.logger.error(`Latest value query failed: ${error.message}`, error.stack);
            reject(error);
          },
          complete: () => {
            resolve(result.length > 0 ? result[0] : null);
          },
        });
      });
    } catch (error) {
      this.logger.error(`Failed to get latest sensor value: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteSensorData(sensorId: string, userId: string): Promise<void> {
    try {
      // Use the HTTP API directly since deleteAPI might not be available in this version
      const start = '1970-01-01T00:00:00Z';
      const stop = new Date().toISOString();

      const deletePayload = {
        start,
        stop,
        predicate: `sensor_id="${sensorId}" AND user_id="${userId}"`,
      };

      // For now, we'll log the delete operation
      // In a production environment, you might want to use the REST API directly
      this.logger.log(`Would delete sensor data for sensor ${sensorId} with predicate: ${deletePayload.predicate}`);

      // TODO: Implement proper delete using HTTP client if needed
    } catch (error) {
      this.logger.error(`Failed to delete sensor data: ${error.message}`, error.stack);
      throw error;
    }
  }
}
