import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SensorsService } from './sensors.service';
import { Sensor } from './entities/sensor.entity';
import { CreateSensorInput } from './dto/create-sensor.input';
import { UpdateSensorInput } from './dto/update-sensor.input';
import { SensorDataQueryInput } from './dto/sensor-data-query.input';
import { SendCommandInput } from './dto/send-command.input';
import { MqttConnectionInfo } from './dto/mqtt-connection-info.response';
import { SensorDataPoint } from './dto/sensor-data-point.response';

@Resolver(() => Sensor)
@UseGuards(JwtAuthGuard)
export class SensorsResolver {
  constructor(private readonly sensorsService: SensorsService) {}

  // Sensor Queries
  @Query(() => Sensor, { name: 'getSensor' })
  async getSensor(@Args('id', { type: () => ID }) id: string): Promise<Sensor> {
    return this.sensorsService.findSensorById(id);
  }

  @Query(() => [Sensor], { name: 'getUserSensors' })
  async getUserSensors(@CurrentUser('id') userId: string): Promise<Sensor[]> {
    return this.sensorsService.findUserSensors(userId);
  }

  @Query(() => [Sensor], { name: 'getGardenSensors' })
  async getGardenSensors(@Args('gardenId', { type: () => ID }) gardenId: string, @CurrentUser('id') userId: string): Promise<Sensor[]> {
    return this.sensorsService.findGardenSensors(gardenId, userId);
  }

  @Query(() => [Sensor], { name: 'getCultivationSensors' })
  async getCultivationSensors(@Args('cultivationId', { type: () => ID }) cultivationId: string, @CurrentUser('id') userId: string): Promise<Sensor[]> {
    return this.sensorsService.findCultivationSensors(cultivationId, userId);
  }

  // Sensor Mutations
  @Mutation(() => Sensor)
  async createSensor(@Args('input') createSensorInput: CreateSensorInput, @CurrentUser('id') userId: string): Promise<Sensor> {
    return this.sensorsService.createSensor(createSensorInput, userId);
  }

  @Mutation(() => Sensor)
  async updateSensor(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateSensorInput: UpdateSensorInput,
    @CurrentUser('id') userId: string,
  ): Promise<Sensor> {
    return this.sensorsService.updateSensor(id, updateSensorInput, userId);
  }

  @Mutation(() => Boolean)
  async deleteSensor(@Args('id', { type: () => ID }) id: string, @CurrentUser('id') userId: string): Promise<boolean> {
    return this.sensorsService.deleteSensor(id, userId);
  }

  // MQTT and Data Queries
  @Query(() => MqttConnectionInfo, { name: 'getMqttConnectionInfo' })
  async getMqttConnectionInfo(@Args('sensorId', { type: () => ID }) sensorId: string, @CurrentUser('id') userId: string): Promise<MqttConnectionInfo> {
    return this.sensorsService.getMqttConnectionInfo(sensorId, userId);
  }

  @Query(() => [SensorDataPoint], { name: 'getSensorData' })
  async getSensorData(
    @Args('sensorId', { type: () => ID }) sensorId: string,
    @Args('query') query: SensorDataQueryInput,
    @CurrentUser('id') userId: string,
  ): Promise<SensorDataPoint[]> {
    return this.sensorsService.getSensorData(sensorId, userId, query);
  }

  @Query(() => SensorDataPoint, { name: 'getLatestSensorValue', nullable: true })
  async getLatestSensorValue(@Args('sensorId', { type: () => ID }) sensorId: string, @CurrentUser('id') userId: string): Promise<SensorDataPoint | null> {
    return this.sensorsService.getLatestSensorValue(sensorId, userId);
  }

  // MQTT Commands
  @Mutation(() => Boolean)
  async sendSensorCommand(
    @Args('sensorId', { type: () => ID }) sensorId: string,
    @Args('input') input: SendCommandInput,
    @CurrentUser('id') userId: string,
  ): Promise<boolean> {
    await this.sensorsService.sendSensorCommand(sensorId, userId, input.command, input.parameters);
    return true;
  }
}
