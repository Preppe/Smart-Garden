import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Sensor } from './entities/sensor.entity';
import { Garden } from '../gardens/entities/garden.entity';
import { Cultivation } from '../gardens/entities/cultivation.entity';
import { User } from '../users/entities/user.entity';
import { GardensService } from '../gardens/gardens.service';
import { CreateSensorInput } from './dto/create-sensor.input';
import { UpdateSensorInput } from './dto/update-sensor.input';
import { MqttService } from './mqtt.service';
import { InfluxDbService, SensorDataQuery } from './influxdb.service';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private sensorsRepository: Repository<Sensor>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private gardensService: GardensService,
    private mqttService: MqttService,
    private influxDbService: InfluxDbService,
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

    // Validate required parameters for MQTT topic generation
    if (!userId) {
      throw new BadRequestException('User ID is required for sensor creation');
    }
    if (!createSensorInput.deviceId || createSensorInput.deviceId.trim() === '') {
      throw new BadRequestException('Device ID is required and cannot be empty');
    }

    // Check if user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if deviceId already exists for this user
    const existingSensor = await this.sensorsRepository.findOne({
      where: { deviceId: createSensorInput.deviceId, user: { id: userId } }
    });
    if (existingSensor) {
      throw new BadRequestException(`Device ID '${createSensorInput.deviceId}' already exists for this user`);
    }
    
    // Generate MQTT configuration
    const connectionToken = uuidv4();
    const mqttTopic = this.mqttService.generateSensorTopic(userId, createSensorInput.deviceId);

    const sensor = this.sensorsRepository.create({
      ...sensorData,
      locationLevel,
      user,
      garden,
      cultivation,
      mqttTopic,
      connectionToken,
    });

    // Register the token with MQTT service
    this.mqttService.registerValidToken(connectionToken);

    return this.sensorsRepository.save(sensor);
  }

  async findSensorById(id: string): Promise<Sensor> {
    const sensor = await this.sensorsRepository.findOne({
      where: { id },
      relations: { user: true, garden: true, cultivation: { garden: true } },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    return sensor;
  }

  async findUserSensors(userId: string): Promise<Sensor[]> {
    return this.sensorsRepository.find({
      where: { user: { id: userId } },
      relations: { garden: true, cultivation: { garden: true } },
    });
  }

  async findGardenSensors(gardenId: string, userId: string): Promise<Sensor[]> {
    // Verify garden ownership
    await this.gardensService.validateGardenOwnership(gardenId, userId);

    return this.sensorsRepository.find({
      where: [
        { user: { id: userId }, garden: { id: gardenId } },
        { user: { id: userId }, cultivation: { garden: { id: gardenId } } }
      ],
      relations: { garden: true, cultivation: { garden: true } },
    });
  }

  async findCultivationSensors(cultivationId: string, userId: string): Promise<Sensor[]> {
    // Verify cultivation ownership
    await this.gardensService.validateCultivationOwnership(cultivationId, userId);

    return this.sensorsRepository.find({
      where: { user: { id: userId }, cultivation: { id: cultivationId } },
      relations: { garden: true, cultivation: { garden: true } },
    });
  }

  async updateSensor(id: string, updateSensorInput: UpdateSensorInput, userId: string): Promise<Sensor> {
    const sensor = await this.sensorsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { user: true, garden: true, cultivation: { garden: true } },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    Object.assign(sensor, updateSensorInput);
    return this.sensorsRepository.save(sensor);
  }

  async deleteSensor(id: string, userId: string): Promise<boolean> {
    const sensor = await this.sensorsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { user: true, garden: true, cultivation: { garden: true } },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    // Clean up MQTT token and InfluxDB data
    this.mqttService.unregisterToken(sensor.connectionToken);
    await this.influxDbService.deleteSensorData(sensor.id, userId);

    await this.sensorsRepository.remove(sensor);
    return true;
  }

  async getMqttConnectionInfo(sensorId: string, userId: string) {
    const sensor = await this.sensorsRepository.findOne({
      where: { id: sensorId, user: { id: userId } },
      relations: { user: true },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    return this.mqttService.getMqttConnectionInfo(userId, sensor.id, sensor.connectionToken);
  }

  async getSensorData(sensorId: string, userId: string, query: Omit<SensorDataQuery, 'sensorId' | 'userId'>) {
    // Verify sensor ownership and get sensor details
    const sensor = await this.sensorsRepository.findOne({
      where: { id: sensorId, user: { id: userId } },
      relations: { user: true },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    // Use deviceId for InfluxDB query, not the UUID
    const fullQuery = {
      ...query,
      sensorId: sensor.deviceId, // Use deviceId instead of UUID
      userId,
    };

    return this.influxDbService.getSensorData(fullQuery);
  }

  async getLatestSensorValue(sensorId: string, userId: string) {
    // Verify sensor ownership and get sensor details
    const sensor = await this.sensorsRepository.findOne({
      where: { id: sensorId, user: { id: userId } },
      relations: { user: true },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    // Use deviceId for InfluxDB query, not the UUID
    return this.influxDbService.getLatestSensorValue(sensor.deviceId, userId);
  }

  async sendSensorCommand(sensorId: string, userId: string, command: string, parameters?: Record<string, any>) {
    // Verify sensor ownership
    await this.validateSensorOwnership(sensorId, userId);

    return this.mqttService.sendCommand(userId, sensorId, {
      command,
      parameters,
      timestamp: new Date().toISOString(),
    });
  }

  private async validateSensorOwnership(sensorId: string, userId: string): Promise<void> {
    const sensor = await this.sensorsRepository.findOne({
      where: { id: sensorId, user: { id: userId } },
      relations: { user: true },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }
  }

}
