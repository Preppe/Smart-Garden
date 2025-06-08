import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SensorsService } from './sensors.service';
import { Sensor } from './entities/sensor.entity';
import { CreateSensorInput } from './dto/create-sensor.input';
import { UpdateSensorInput } from './dto/update-sensor.input';

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
  async getUserSensors(@CurrentUser('sub') userId: string): Promise<Sensor[]> {
    return this.sensorsService.findUserSensors(userId);
  }

  @Query(() => [Sensor], { name: 'getGardenSensors' })
  async getGardenSensors(@Args('gardenId', { type: () => ID }) gardenId: string, @CurrentUser('sub') userId: string): Promise<Sensor[]> {
    return this.sensorsService.findGardenSensors(gardenId, userId);
  }

  @Query(() => [Sensor], { name: 'getCultivationSensors' })
  async getCultivationSensors(@Args('cultivationId', { type: () => ID }) cultivationId: string, @CurrentUser('sub') userId: string): Promise<Sensor[]> {
    return this.sensorsService.findCultivationSensors(cultivationId, userId);
  }

  // Sensor Mutations
  @Mutation(() => Sensor)
  async createSensor(@Args('input') createSensorInput: CreateSensorInput, @CurrentUser('sub') userId: string): Promise<Sensor> {
    return this.sensorsService.createSensor(createSensorInput, userId);
  }

  @Mutation(() => Sensor)
  async updateSensor(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateSensorInput: UpdateSensorInput,
    @CurrentUser('sub') userId: string,
  ): Promise<Sensor> {
    return this.sensorsService.updateSensor(id, updateSensorInput, userId);
  }

  @Mutation(() => Boolean)
  async deleteSensor(@Args('id', { type: () => ID }) id: string, @CurrentUser('sub') userId: string): Promise<boolean> {
    return this.sensorsService.deleteSensor(id, userId);
  }
}
