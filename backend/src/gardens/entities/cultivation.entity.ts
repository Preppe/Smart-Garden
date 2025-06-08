import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Garden } from './garden.entity';
import { Sensor } from '../../sensors/entities/sensor.entity';

export enum GrowthStage {
  SEED = 'seed',
  SEEDLING = 'seedling',
  VEGETATIVE = 'vegetative',
  FLOWERING = 'flowering',
  FRUITING = 'fruiting',
  HARVEST = 'harvest',
}

registerEnumType(GrowthStage, {
  name: 'GrowthStage',
  description: 'Growth stage of the plant',
});

@Entity('cultivations')
@ObjectType()
export class Cultivation {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  plantName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  variety?: string;

  @Field(() => Date)
  @Column({ type: 'date', transformer: { to: (date: Date) => date, from: (date: string) => new Date(date) } })
  plantedDate: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'date', nullable: true })
  expectedHarvestDate?: Date;

  @Field(() => GrowthStage)
  @Column({
    type: 'enum',
    enum: GrowthStage,
    default: GrowthStage.SEEDLING,
  })
  growthStage: GrowthStage;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Field(() => Garden)
  @ManyToOne(() => Garden, (garden) => garden.cultivations, {
    onDelete: 'CASCADE',
  })
  garden: Garden;

  @Field(() => [Sensor])
  @OneToMany(() => Sensor, (sensor) => sensor.cultivation)
  sensors: Sensor[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
