import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsService } from './sensors.service';
import { SensorsResolver } from './sensors.resolver';
import { Sensor } from './entities/sensor.entity';
import { User } from '../users/entities/user.entity';
import { GardensModule } from '../gardens/gardens.module';
import { MqttService } from './mqtt.service';
import { InfluxDbService } from './influxdb.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, User]), GardensModule],
  providers: [SensorsService, SensorsResolver, MqttService, InfluxDbService],
  exports: [SensorsService, MqttService, InfluxDbService],
})
export class SensorsModule {}
