import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './entities/sensor.entity';
import { Garden } from '../gardens/entities/garden.entity';
import { Cultivation } from '../gardens/entities/cultivation.entity';
import { GardensService } from '../gardens/gardens.service';
import { CreateSensorInput } from './dto/create-sensor.input';
import { UpdateSensorInput } from './dto/update-sensor.input';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private sensorsRepository: Repository<Sensor>,
    private gardensService: GardensService,
  ) {}

  async createSensor(createSensorInput: CreateSensorInput, userId: string): Promise<Sensor> {
    const { gardenId, cultivationId, locationLevel, ...sensorData } = createSensorInput;

    // Validate location level consistency
    if (locationLevel === 'garden' && !gardenId) {
      throw new BadRequestException('Garden ID is required for garden-level sensors');
    }
    if (locationLevel === 'cultivation' && !cultivationId) {
      throw new BadRequestException('Cultivation ID is required for cultivation-level sensors');
    }

    let garden: Garden | undefined = undefined;
    let cultivation: Cultivation | undefined = undefined;

    if (gardenId) {
      garden = await this.gardensService.validateGardenOwnership(gardenId, userId);
    }

    if (cultivationId) {
      cultivation = await this.gardensService.validateCultivationOwnership(cultivationId, userId);
    }

    const sensor = this.sensorsRepository.create({
      ...sensorData,
      locationLevel,
      garden,
      cultivation,
    });

    return this.sensorsRepository.save(sensor);
  }

  async findSensorById(id: string): Promise<Sensor> {
    const sensor = await this.sensorsRepository.findOne({
      where: { id },
      relations: { garden: true, cultivation: true },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    return sensor;
  }

  async findUserSensors(userId: string): Promise<Sensor[]> {
    return this.sensorsRepository.find({
      where: [{ garden: { user: { id: userId } } }, { cultivation: { garden: { user: { id: userId } } } }],
      relations: { garden: true, cultivation: true },
    });
  }

  async findGardenSensors(gardenId: string, userId: string): Promise<Sensor[]> {
    // Verify garden ownership
    await this.gardensService.validateGardenOwnership(gardenId, userId);

    return this.sensorsRepository.find({
      where: [{ garden: { id: gardenId } }, { cultivation: { garden: { id: gardenId } } }],
      relations: { garden: true, cultivation: true },
    });
  }

  async findCultivationSensors(cultivationId: string, userId: string): Promise<Sensor[]> {
    // Verify cultivation ownership
    await this.gardensService.validateCultivationOwnership(cultivationId, userId);

    return this.sensorsRepository.find({
      where: { cultivation: { id: cultivationId } },
      relations: { garden: true, cultivation: true },
    });
  }

  async updateSensor(id: string, updateSensorInput: UpdateSensorInput, userId: string): Promise<Sensor> {
    const sensor = await this.sensorsRepository.findOne({
      where: [
        { id, garden: { user: { id: userId } } },
        { id, cultivation: { garden: { user: { id: userId } } } },
      ],
      relations: { garden: true, cultivation: true },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    Object.assign(sensor, updateSensorInput);
    return this.sensorsRepository.save(sensor);
  }

  async deleteSensor(id: string, userId: string): Promise<boolean> {
    const sensor = await this.sensorsRepository.findOne({
      where: [
        { id, garden: { user: { id: userId } } },
        { id, cultivation: { garden: { user: { id: userId } } } },
      ],
      relations: { garden: true, cultivation: true },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    await this.sensorsRepository.remove(sensor);
    return true;
  }
}
