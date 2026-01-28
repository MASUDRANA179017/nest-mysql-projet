import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Offer } from './offer.entity';

export enum ReportedBy {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ReportStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
}

@Entity('offer_reports')
export class OfferReport {
  @ApiProperty({ example: 1, description: 'The unique identifier' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 1, description: 'The offer ID' })
  @Column({ name: 'offer_id', type: 'bigint' })
  offerId: number;

  @ApiProperty({ example: 'Inappropriate content', description: 'The reason for the report' })
  @Column({ type: 'text' })
  reason: string;

  @ApiProperty({ enum: ReportedBy, example: ReportedBy.USER, description: 'Who reported the offer' })
  @Column({
    name: 'reported_by',
    type: 'enum',
    enum: ReportedBy,
  })
  reportedBy: ReportedBy;

  @ApiProperty({ enum: ReportStatus, example: ReportStatus.OPEN, description: 'The status of the report' })
  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.OPEN,
  })
  status: ReportStatus;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Offer, (offer) => offer.reports)
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;
}
