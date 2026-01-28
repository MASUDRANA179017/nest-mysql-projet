import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Area } from './area.entity';
import { Merchant } from './merchant.entity';
import { Offer } from './offer.entity';
import { VisitorSession } from './visitor-session.entity';

@Entity('cities')
export class City {
  @ApiProperty({ example: 1, description: 'The unique identifier of the city' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 'New York', description: 'The name of the city' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ example: true, description: 'Whether the city is active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Area, (area) => area.city)
  areas: Area[];

  @OneToMany(() => Merchant, (merchant) => merchant.city)
  merchants: Merchant[];

  @OneToMany(() => Offer, (offer) => offer.city)
  offers: Offer[];

  @OneToMany(() => VisitorSession, (session) => session.city)
  visitorSessions: VisitorSession[];
}
