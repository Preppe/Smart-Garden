import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class SensorDataQueryInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  start: string; // RFC3339 timestamp

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  stop?: string; // RFC3339 timestamp

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  aggregateWindow?: string; // e.g., '1m', '5m', '1h'
}
