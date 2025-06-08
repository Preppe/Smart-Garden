import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNumber, IsString } from 'class-validator';

@InputType()
export class GardenLocationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;
}
