import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GardensService } from './gardens.service';
import { GardensResolver } from './gardens.resolver';
import { Garden } from './entities/garden.entity';
import { Cultivation } from './entities/cultivation.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Garden, Cultivation]), UsersModule],
  providers: [GardensService, GardensResolver],
  exports: [GardensService],
})
export class GardensModule {}
