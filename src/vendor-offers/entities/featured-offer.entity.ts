import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Offer } from './offer.entity';

export enum FeaturedPosition {
  HOME_TOP = 'home_top',
  CATEGORY_TOP = 'category_top',
  CITY_TOP = 'city_top',
  FESTIVAL = 'festival',
}

@Entity('featured_offers')
export class FeaturedOffer {
  @ApiProperty({ example: 1, description: 'The unique identifier' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 1, description: 'The offer ID' })
  @Column({ name: 'offer_id', type: 'bigint' })
  offerId: number;

  @ApiProperty({ enum: FeaturedPosition, example: FeaturedPosition.HOME_TOP, description: 'The position where the offer is featured' })
  @Column({
    type: 'enum',
    enum: FeaturedPosition,
  })
  position: FeaturedPosition;

  @ApiProperty({ example: '2023-01-01', description: 'The start date' })
  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @ApiProperty({ example: '2023-01-31', description: 'The end date' })
  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @ApiProperty({ example: true, description: 'Is the feature paid?' })
  @Column({ name: 'is_paid', default: false })
  isPaid: boolean;

  @ManyToOne(() => Offer, (offer) => offer.featured)
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;
}
