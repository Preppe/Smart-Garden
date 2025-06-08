import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Garden } from './entities/garden.entity';
import { Cultivation } from './entities/cultivation.entity';
import { UsersService } from '../users/users.service';
import { CreateGardenInput } from './dto/create-garden.input';
import { UpdateGardenInput } from './dto/update-garden.input';
import { CreateCultivationInput } from './dto/create-cultivation.input';
import { UpdateCultivationInput } from './dto/update-cultivation.input';

@Injectable()
export class GardensService {
  constructor(
    @InjectRepository(Garden)
    private gardensRepository: Repository<Garden>,
    @InjectRepository(Cultivation)
    private cultivationsRepository: Repository<Cultivation>,
    private usersService: UsersService,
  ) {}

  // Garden CRUD Operations
  async createGarden(createGardenInput: CreateGardenInput, userId: string): Promise<Garden> {
    const user = await this.usersService.findOne(userId);

    const garden = this.gardensRepository.create({
      ...createGardenInput,
      user,
    });

    return this.gardensRepository.save(garden);
  }

  async findUserGardens(userId: string): Promise<Garden[]> {
    return this.gardensRepository.find({
      where: { user: { id: userId } },
      relations: { cultivations: true, sensors: true },
    });
  }

  async findGardenById(id: string): Promise<Garden> {
    const garden = await this.gardensRepository.findOne({
      where: { id },
      relations: { user: true, cultivations: true, sensors: true },
    });

    if (!garden) {
      throw new NotFoundException('Garden not found');
    }

    return garden;
  }

  async updateGarden(id: string, updateGardenInput: UpdateGardenInput, userId: string): Promise<Garden> {
    const garden = await this.gardensRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!garden) {
      throw new NotFoundException('Garden not found');
    }

    Object.assign(garden, updateGardenInput);
    return this.gardensRepository.save(garden);
  }

  async deleteGarden(id: string, userId: string): Promise<boolean> {
    const result = await this.gardensRepository.delete({
      id,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Garden not found');
    }

    return true;
  }

  // Validation methods for sensors module
  async validateGardenOwnership(gardenId: string, userId: string): Promise<Garden> {
    const garden = await this.gardensRepository.findOne({
      where: { id: gardenId, user: { id: userId } },
    });

    if (!garden) {
      throw new NotFoundException('Garden not found');
    }

    return garden;
  }

  async validateCultivationOwnership(cultivationId: string, userId: string): Promise<Cultivation> {
    const cultivation = await this.cultivationsRepository.findOne({
      where: { id: cultivationId, garden: { user: { id: userId } } },
      relations: { garden: true },
    });

    if (!cultivation) {
      throw new NotFoundException('Cultivation not found');
    }

    return cultivation;
  }

  // Cultivation CRUD Operations
  async createCultivation(createCultivationInput: CreateCultivationInput, userId: string): Promise<Cultivation> {
    const garden = await this.gardensRepository.findOne({
      where: { id: createCultivationInput.gardenId, user: { id: userId } },
    });

    if (!garden) {
      throw new NotFoundException('Garden not found');
    }

    const cultivation = this.cultivationsRepository.create({
      ...createCultivationInput,
      garden,
    });

    return this.cultivationsRepository.save(cultivation);
  }

  async findCultivationById(id: string): Promise<Cultivation> {
    const cultivation = await this.cultivationsRepository.findOne({
      where: { id },
      relations: { garden: true, sensors: true },
    });

    if (!cultivation) {
      throw new NotFoundException('Cultivation not found');
    }

    return cultivation;
  }

  async updateCultivation(id: string, updateCultivationInput: UpdateCultivationInput, userId: string): Promise<Cultivation> {
    const cultivation = await this.cultivationsRepository.findOne({
      where: { id, garden: { user: { id: userId } } },
      relations: { garden: true },
    });

    if (!cultivation) {
      throw new NotFoundException('Cultivation not found');
    }

    Object.assign(cultivation, updateCultivationInput);
    return this.cultivationsRepository.save(cultivation);
  }

  async deleteCultivation(id: string, userId: string): Promise<boolean> {
    const cultivation = await this.cultivationsRepository.findOne({
      where: { id, garden: { user: { id: userId } } },
      relations: { garden: true },
    });

    if (!cultivation) {
      throw new NotFoundException('Cultivation not found');
    }

    await this.cultivationsRepository.remove(cultivation);
    return true;
  }

  async findUserCultivations(userId: string): Promise<Cultivation[]> {
    return this.cultivationsRepository.find({
      where: { garden: { user: { id: userId } } },
      relations: { garden: true, sensors: true },
      order: { createdAt: 'DESC' },
    });
  }
}
