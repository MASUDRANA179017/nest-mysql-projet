import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Offer } from './offer.entity';

@Entity('offer_bookmarks')
export class OfferBookmark {
  @ApiProperty({ example: 1, description: 'The unique identifier' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 1, description: 'The offer ID' })
  @Column({ name: 'offer_id', type: 'bigint' })
  offerId: number;

  @ApiProperty({ example: 'session-123', description: 'The session ID' })
  @Column({ name: 'session_id', length: 100 })
  sessionId: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Offer, (offer) => offer.bookmarks)
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;
}
