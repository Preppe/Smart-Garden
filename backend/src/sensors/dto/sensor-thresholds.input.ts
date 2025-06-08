import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class SensorThresholdsInput {
  @Field({ nullable: true })
  @IsOptional()
  min?: number;

  @Field({ nullable: true })
  @IsOptional()
  max?: number;

  @Field({ nullable: true })
  @IsOptional()
  optimal_min?: number;

  @Field({ nullable: true })
  @IsOptional()
  optimal_max?: number;
}
