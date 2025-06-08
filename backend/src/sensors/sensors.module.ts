import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsService } from './sensors.service';
import { SensorsResolver } from './sensors.resolver';
import { Sensor } from './entities/sensor.entity';
import { GardensModule } from '../gardens/gardens.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor]), GardensModule],
  providers: [SensorsService, SensorsResolver],
  exports: [SensorsService],
})
export class SensorsModule {}
