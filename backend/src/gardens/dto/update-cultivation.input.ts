import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { GrowthStage } from '../entities/cultivation.entity';

@InputType()
export class UpdateCultivationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  plantName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  variety?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  plantedDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedHarvestDate?: Date;

  @Field(() => GrowthStage, { nullable: true })
  @IsOptional()
  @IsEnum(GrowthStage)
  growthStage?: GrowthStage;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
