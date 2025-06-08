import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsBoolean, IsObject } from 'class-validator';
import { SensorType, SensorLocationLevel } from '../entities/sensor.entity';
import { SensorCalibrationInput } from './sensor-calibration.input';
import { SensorThresholdsInput } from './sensor-thresholds.input';

@InputType()
export class CreateSensorInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => SensorType)
  @IsEnum(SensorType)
  type: SensorType;

  @Field()
  @IsNotEmpty()
  @IsString()
  unit: string;

  @Field(() => SensorLocationLevel)
  @IsEnum(SensorLocationLevel)
  locationLevel: SensorLocationLevel;

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
