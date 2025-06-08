import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class SensorCalibrationInput {
  @Field({ nullable: true })
  @IsOptional()
  offset?: number;

  @Field({ nullable: true })
  @IsOptional()
  multiplier?: number;

  @Field({ nullable: true })
  @IsOptional()
  lastCalibrated?: Date;
}
