import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Garden } from '../../gardens/entities/garden.entity';
import { Cultivation } from '../../gardens/entities/cultivation.entity';
import { User } from '../../users/entities/user.entity';

export enum SensorType {
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  SOIL_MOISTURE = 'soil_moisture',
  LIGHT = 'light',
  PH = 'ph',
  AIR_QUALITY = 'air_quality',
}

export enum SensorLocationLevel {
  GARDEN = 'garden',
  CULTIVATION = 'cultivation',
}

registerEnumType(SensorType, {
  name: 'SensorType',
  description: 'Type of sensor measurement',
});

registerEnumType(SensorLocationLevel, {
  name: 'SensorLocationLevel',
  description: 'Level where the sensor is installed',
});

@ObjectType()
class SensorCalibration {
  @Field({ nullable: true })
  offset?: number;

  @Field({ nullable: true })
  multiplier?: number;

  @Field(() => Date, { nullable: true })
  lastCalibrated?: Date;
}

@ObjectType()
class SensorThresholds {
  @Field({ nullable: true })
  min?: number;

  @Field({ nullable: true })
  max?: number;

  @Field({ nullable: true })
  optimal_min?: number;

  @Field({ nullable: true })
  optimal_max?: number;
}

@Entity('sensors')
@ObjectType()
@Unique(['deviceId', 'user'])
export class Sensor {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  deviceId: string;

  @Field()
  @Column()
  name: string;

  @Field(() => SensorType)
  @Column({
    type: 'enum',
    enum: SensorType,
  })
  type: SensorType;

  @Field()
  @Column()
  unit: string;

  @Field(() => SensorLocationLevel)
  @Column({
    type: 'enum',
    enum: SensorLocationLevel,
  })
  locationLevel: SensorLocationLevel;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ unique: true })
  mqttTopic: string;

  @Field()
  @Column({ unique: true })
  connectionToken: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  lastDataReceived?: Date;

  @Field(() => SensorCalibration, { nullable: true })
  @Column('json', { nullable: true })
  calibration?: SensorCalibration;

  @Field(() => SensorThresholds, { nullable: true })
  @Column('json', { nullable: true })
  thresholds?: SensorThresholds;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  // Flexible relationships - only one will be set based on locationLevel
  @Field(() => Garden, { nullable: true })
  @ManyToOne(() => Garden, (garden) => garden.sensors, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  garden?: Garden;

  @Field(() => Cultivation, { nullable: true })
  @ManyToOne(() => Cultivation, (cultivation) => cultivation.sensors, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  cultivation?: Cultivation;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
