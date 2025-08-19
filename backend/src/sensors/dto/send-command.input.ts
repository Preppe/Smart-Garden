import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class SendCommandInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  command: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;
}
