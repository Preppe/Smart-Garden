import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GardensService } from './gardens.service';
import { Garden } from './entities/garden.entity';
import { Cultivation } from './entities/cultivation.entity';
import { CreateGardenInput } from './dto/create-garden.input';
import { UpdateGardenInput } from './dto/update-garden.input';
import { CreateCultivationInput } from './dto/create-cultivation.input';
import { UpdateCultivationInput } from './dto/update-cultivation.input';

@Resolver()
@UseGuards(JwtAuthGuard)
export class GardensResolver {
  constructor(private readonly gardensService: GardensService) {}

  // Garden Queries
  @Query(() => [Garden], { name: 'getUserGardens' })
  async getUserGardens(@CurrentUser('sub') userId: string): Promise<Garden[]> {
    return this.gardensService.findUserGardens(userId);
  }

  @Query(() => Garden, { name: 'getGarden' })
  async getGarden(@Args('id', { type: () => ID }) id: string): Promise<Garden> {
    return this.gardensService.findGardenById(id);
  }

  // Garden Mutations
  @Mutation(() => Garden)
  async createGarden(@Args('input') createGardenInput: CreateGardenInput, @CurrentUser('sub') userId: string): Promise<Garden> {
    return this.gardensService.createGarden(createGardenInput, userId);
  }

  @Mutation(() => Garden)
  async updateGarden(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateGardenInput: UpdateGardenInput,
    @CurrentUser('sub') userId: string,
  ): Promise<Garden> {
    return this.gardensService.updateGarden(id, updateGardenInput, userId);
  }

  @Mutation(() => Boolean)
  async deleteGarden(@Args('id', { type: () => ID }) id: string, @CurrentUser('sub') userId: string): Promise<boolean> {
    return this.gardensService.deleteGarden(id, userId);
  }

  // Cultivation Queries
  @Query(() => [Cultivation], { name: 'getUserCultivations' })
  async getUserCultivations(@CurrentUser('sub') userId: string): Promise<Cultivation[]> {
    return this.gardensService.findUserCultivations(userId);
  }

  @Query(() => Cultivation, { name: 'getCultivation' })
  async getCultivation(@Args('id', { type: () => ID }) id: string): Promise<Cultivation> {
    return this.gardensService.findCultivationById(id);
  }

  // Cultivation Mutations
  @Mutation(() => Cultivation)
  async createCultivation(@Args('input') createCultivationInput: CreateCultivationInput, @CurrentUser('sub') userId: string): Promise<Cultivation> {
    return this.gardensService.createCultivation(createCultivationInput, userId);
  }

  @Mutation(() => Cultivation)
  async updateCultivation(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateCultivationInput: UpdateCultivationInput,
    @CurrentUser('sub') userId: string,
  ): Promise<Cultivation> {
    return this.gardensService.updateCultivation(id, updateCultivationInput, userId);
  }

  @Mutation(() => Boolean)
  async deleteCultivation(@Args('id', { type: () => ID }) id: string, @CurrentUser('sub') userId: string): Promise<boolean> {
    return this.gardensService.deleteCultivation(id, userId);
  }
}
