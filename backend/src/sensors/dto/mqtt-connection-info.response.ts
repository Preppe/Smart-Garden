import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class MqttConnectionInfo {
  @Field()
  host: string;

  @Field(() => Int)
  port: number;

  @Field(() => Int)
  wsPort: number;

  @Field()
  dataTopicPublish: string;

  @Field()
  commandTopicSubscribe: string;

  @Field()
  statusTopicPublish: string;

  @Field()
  token: string;

  @Field(() => Int)
  keepalive: number;

  @Field()
  clientIdPrefix: string;
}
