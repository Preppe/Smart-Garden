import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class SensorDataPoint {
  @Field()
  time: string;

  @Field(() => Float)
  value: number;

  @Field()
  sensorId: string;

  @Field()
  userId: string;
}
