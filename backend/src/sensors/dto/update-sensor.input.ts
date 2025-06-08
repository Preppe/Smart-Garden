import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsUUID, IsBoolean, IsObject } from 'class-validator';
import { SensorType, SensorLocationLevel } from '../entities/sensor.entity';
import { SensorCalibrationInput } from './sensor-calibration.input';
import { SensorThresholdsInput } from './sensor-thresholds.input';

@InputType()
export class UpdateSensorInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => SensorType, { nullable: true })
  @IsOptional()
  @IsEnum(SensorType)
  type?: SensorType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  unit?: string;

  @Field(() => SensorLocationLevel, { nullable: true })
  @IsOptional()
  @IsEnum(SensorLocationLevel)
  locationLevel?: SensorLocationLevel;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  gardenId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  cultivationId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => SensorCalibrationInput, { nullable: true })
  @IsOptional()
  @IsObject()
  calibration?: SensorCalibrationInput;

  @Field(() => SensorThresholdsInput, { nullable: true })
  @IsOptional()
  @IsObject()
  thresholds?: SensorThresholdsInput;
}
