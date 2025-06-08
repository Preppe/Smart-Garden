import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { GrowthStage } from '../entities/cultivation.entity';

@InputType()
export class CreateCultivationInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  gardenId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  plantName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  variety?: string;

  @Field(() => Date)
  @IsDate()
  @Type(() => Date)
  plantedDate: Date;

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
