import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Merchant } from './merchant.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

@Entity('merchant_subscriptions')
export class MerchantSubscription {
  @ApiProperty({ example: 1, description: 'The unique identifier of the subscription' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 1, description: 'The merchant ID' })
  @Column({ name: 'merchant_id', type: 'bigint' })
  merchantId: number;

  @ApiProperty({ example: 'Premium Plan', description: 'The plan name' })
  @Column({ name: 'plan_name', length: 100 })
  planName: string;

  @ApiProperty({ example: 99.99, description: 'The price' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ example: '2023-01-01', description: 'The start date' })
  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @ApiProperty({ example: '2023-12-31', description: 'The end date' })
  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @ApiProperty({ enum: SubscriptionStatus, example: SubscriptionStatus.ACTIVE, description: 'The status of the subscription' })
  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @ManyToOne(() => Merchant, (merchant) => merchant.subscriptions)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}
