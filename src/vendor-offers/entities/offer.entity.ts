import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Merchant } from '../../entity/merchant.entity';
import { OfferCategory } from './offer-category.entity';
import { City } from './city.entity';
import { Area } from './area.entity';
import { OfferTemplate, OfferType } from './offer-template.entity';
import { OfferClick } from './offer-click.entity';
import { OfferBookmark } from './offer-bookmark.entity';
import { OfferReport } from './offer-report.entity';
import { FeaturedOffer } from './featured-offer.entity';

export enum OfferStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('offers')
export class Offer {
  @ApiProperty({ example: 1, description: 'The unique identifier of the offer' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 1, description: 'The merchant ID' })
  @Column({ name: 'merchant_id', type: 'bigint' })
  merchantId: number;

  @ApiProperty({ example: 1, description: 'The category ID' })
  @Column({ name: 'category_id', type: 'bigint' })
  categoryId: number;

  @ApiProperty({ example: 1, description: 'The city ID' })
  @Column({ name: 'city_id', type: 'bigint' })
  cityId: number;

  @ApiProperty({ example: 1, description: 'The area ID' })
  @Column({ name: 'area_id', type: 'bigint' })
  areaId: number;

  @ApiProperty({ example: 1, description: 'The template ID', required: false })
  @Column({ name: 'template_id', type: 'bigint', nullable: true })
  templateId: number;

  @ApiProperty({ example: 'Big Sale', description: 'The offer title' })
  @Column({ length: 200 })
  title: string;

  @ApiProperty({ example: 'Get 50% off', description: 'The offer description', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ enum: OfferType, example: OfferType.DISCOUNT, description: 'The offer type' })
  @Column({
    name: 'offer_type',
    type: 'enum',
    enum: OfferType,
  })
  offerType: OfferType;

  @ApiProperty({ example: '50% OFF', description: 'The discount text', required: false })
  @Column({ name: 'discount_text', length: 100, nullable: true })
  discountText: string;

  @ApiProperty({ example: 'SALE50', description: 'The promo code', required: false })
  @Column({ name: 'promo_code', length: 50, nullable: true })
  promoCode: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The start date' })
  @Column({ name: 'start_date', type: 'datetime' })
  startDate: Date;

  @ApiProperty({ example: '2023-01-31T23:59:59Z', description: 'The end date' })
  @Column({ name: 'end_date', type: 'datetime' })
  endDate: Date;

  @ApiProperty({ example: 'banner.jpg', description: 'The banner image URL', required: false })
  @Column({ length: 255, nullable: true })
  banner: string;

  @ApiProperty({ example: false, description: 'Is the offer verified?' })
  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @ApiProperty({ example: false, description: 'Is the offer featured?' })
  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @ApiProperty({ enum: OfferStatus, example: OfferStatus.PENDING, description: 'The offer status' })
  @Column({
    type: 'enum',
    enum: OfferStatus,
    default: OfferStatus.PENDING,
  })
  status: OfferStatus;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Merchant, (merchant) => merchant.offers)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @ManyToOne(() => OfferCategory, (category) => category.offers)
  @JoinColumn({ name: 'category_id' })
  category: OfferCategory;

  @ManyToOne(() => City, (city) => city.offers)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Area, (area) => area.offers)
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @ManyToOne(() => OfferTemplate, (template) => template.offers)
  @JoinColumn({ name: 'template_id' })
  template: OfferTemplate;

  @OneToMany(() => OfferClick, (click) => click.offer)
  clicks: OfferClick[];

  @OneToMany(() => OfferBookmark, (bookmark) => bookmark.offer)
  bookmarks: OfferBookmark[];

  @OneToMany(() => OfferReport, (report) => report.offer)
  reports: OfferReport[];

  @OneToMany(() => FeaturedOffer, (featured) => featured.offer)
  featured: FeaturedOffer[];
}
