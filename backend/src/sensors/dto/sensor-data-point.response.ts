import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class SensorDataPoint {
  @Field(() => Int)
  time: number;

  @Field(() => Float)
  value: number;

  @Field()
  sensorId: string;

  @Field()
  userId: string;
}
