import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Cultivation } from './cultivation.entity';
import { Sensor } from '../../sensors/entities/sensor.entity';

export enum GardenType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
  GREENHOUSE = 'greenhouse',
}

registerEnumType(GardenType, {
  name: 'GardenType',
  description: 'Type of garden',
});

@ObjectType()
class GardenLocation {
  @Field({ nullable: true })
  latitude?: number;

  @Field({ nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  address?: string;
}

@Entity('gardens')
@ObjectType()
export class Garden {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => GardenType)
  @Column({
    type: 'enum',
    enum: GardenType,
  })
  type: GardenType;

  @Field(() => GardenLocation, { nullable: true })
  @Column('json', { nullable: true })
  location?: GardenLocation;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  user: User;

  @Field(() => [Cultivation])
  @OneToMany(() => Cultivation, (cultivation) => cultivation.garden, {
    cascade: true,
  })
  cultivations: Cultivation[];

  @Field(() => [Sensor])
  @OneToMany(() => Sensor, (sensor) => sensor.garden)
  sensors: Sensor[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
