import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { City } from './city.entity';
import { Area } from './area.entity';
import { Offer } from './offer.entity';
import { MerchantSubscription } from './merchant-subscription.entity';

export enum MerchantStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  BLOCKED = 'blocked',
}

@Entity('merchants')
export class Merchant {
  @ApiProperty({ example: 1, description: 'The unique identifier of the merchant' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 'Tech Store', description: 'The business name' })
  @Column({ name: 'business_name', length: 200 })
  businessName: string;

  @ApiProperty({ example: 'Jane Doe', description: 'The owner name' })
  @Column({ name: 'owner_name', length: 150 })
  ownerName: string;

  @ApiProperty({ example: '+1234567890', description: 'The phone number' })
  @Column({ length: 20 })
  phone: string;

  @ApiProperty({ example: '+1234567890', description: 'The WhatsApp number', required: false })
  @Column({ length: 20, nullable: true })
  whatsapp: string;

  @ApiProperty({ example: 'merchant@example.com', description: 'The email address', required: false })
  @Column({ length: 150, nullable: true })
  email: string;

  @ApiProperty({ example: '123 Main St', description: 'The address', required: false })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ example: 1, description: 'The city ID' })
  @Column({ name: 'city_id', type: 'bigint' })
  cityId: number;

  @ApiProperty({ example: 1, description: 'The area ID' })
  @Column({ name: 'area_id', type: 'bigint' })
  areaId: number;

  @ApiProperty({ example: 100, description: 'The trust score', default: 0 })
  @Column({ name: 'trust_score', type: 'int', default: 0 })
  trustScore: number;

  @ApiProperty({ enum: MerchantStatus, example: MerchantStatus.PENDING, description: 'The status of the merchant' })
  @Column({
    type: 'enum',
    enum: MerchantStatus,
    default: MerchantStatus.PENDING,
  })
  status: MerchantStatus;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => City, (city) => city.merchants)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Area, (area) => area.merchants)
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @OneToMany(() => Offer, (offer) => offer.merchant)
  offers: Offer[];

  @OneToMany(() => MerchantSubscription, (subscription) => subscription.merchant)
  subscriptions: MerchantSubscription[];
}
