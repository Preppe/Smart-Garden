import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { GardenType } from '../entities/garden.entity';
import { GardenLocationInput } from './garden-location.input';

@InputType()
export class UpdateGardenInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => GardenType, { nullable: true })
  @IsOptional()
  @IsEnum(GardenType)
  type?: GardenType;

  @Field(() => GardenLocationInput, { nullable: true })
  @IsOptional()
  @IsObject()
  location?: GardenLocationInput;
}
