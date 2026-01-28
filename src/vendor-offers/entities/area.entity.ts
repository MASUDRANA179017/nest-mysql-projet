import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { City } from './city.entity';
import { Merchant } from '../../entity/merchant.entity';
import { Offer } from './offer.entity';
import { VisitorSession } from './visitor-session.entity';

@Entity('areas')
export class Area {
  @ApiProperty({ example: 1, description: 'The unique identifier of the area' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 1, description: 'The ID of the city this area belongs to' })
  @Column({ name: 'city_id', type: 'bigint' })
  cityId: number;

  @ApiProperty({ example: 'Downtown', description: 'The name of the area' })
  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => City, (city) => city.areas)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => Merchant, (merchant) => merchant.area)
  merchants: Merchant[];

  @OneToMany(() => Offer, (offer) => offer.area)
  offers: Offer[];

  @OneToMany(() => VisitorSession, (session) => session.area)
  visitorSessions: VisitorSession[];
}
