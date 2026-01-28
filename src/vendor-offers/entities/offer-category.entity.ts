import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Offer } from './offer.entity';

@Entity('offer_categories')
export class OfferCategory {
  @ApiProperty({ example: 1, description: 'The unique identifier of the category' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 'Electronics', description: 'The name of the category' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ example: 'icon-url', description: 'The icon URL of the category', required: false })
  @Column({ length: 100, nullable: true })
  icon: string;

  @OneToMany(() => Offer, (offer) => offer.category)
  offers: Offer[];
}
