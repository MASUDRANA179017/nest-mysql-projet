import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Offer } from './offer.entity';

export enum OfferType {
  DISCOUNT = 'discount',
  PROMO_CODE = 'promo_code',
  FLASH_SALE = 'flash_sale',
  LOCAL_OFFER = 'local_offer',
}

@Entity('offer_templates')
export class OfferTemplate {
  @ApiProperty({ example: 1, description: 'The unique identifier of the template' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 'Holiday Sale', description: 'The title of the template' })
  @Column({ length: 150 })
  title: string;

  @ApiProperty({ example: 'Template description', description: 'The description', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ enum: OfferType, example: OfferType.DISCOUNT, description: 'The type of offer' })
  @Column({
    name: 'offer_type',
    type: 'enum',
    enum: OfferType,
  })
  offerType: OfferType;

  @OneToMany(() => Offer, (offer) => offer.template)
  offers: Offer[];
}
