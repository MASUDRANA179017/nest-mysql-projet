import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Offer } from './offer.entity';

export enum ClickSource {
  WEB = 'web',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
  QR = 'qr',
}

@Entity('offer_clicks')
export class OfferClick {
  @ApiProperty({ example: 1, description: 'The unique identifier' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 1, description: 'The offer ID' })
  @Column({ name: 'offer_id', type: 'bigint' })
  offerId: number;

  @ApiProperty({ enum: ClickSource, example: ClickSource.WEB, description: 'The source of the click' })
  @Column({
    type: 'enum',
    enum: ClickSource,
  })
  source: ClickSource;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The click timestamp' })
  @Column({ name: 'clicked_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  clickedAt: Date;

  @ManyToOne(() => Offer, (offer) => offer.clicks)
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;
}
