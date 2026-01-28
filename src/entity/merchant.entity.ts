
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Store } from './store.entity';
import { Product } from './product.entity';
import { Prescription } from './prescription.entity';
import { Blog } from './blog.entity';
import { Offer } from '../vendor-offers/entities/offer.entity';
import { MerchantSubscription } from '../vendor-offers/entities/merchant-subscription.entity';
import { Area } from '../vendor-offers/entities/area.entity';
import { City } from '../vendor-offers/entities/city.entity';

@Entity()
export class Merchant {
  @ApiProperty({ example: 1, description: 'The unique identifier of the merchant' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Merchant Name', description: 'The name of the merchant' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'Merchant description', description: 'The description of the merchant', required: false })
  @Column({ nullable: true })
  description: string;

  // Relations

  @ApiProperty({ type: () => [Store], description: 'Stores owned by the merchant' })
  @OneToMany(() => Store, (store) => store.merchant)
  stores: Store[];

  @ApiProperty({ type: () => [Product], description: 'Products owned by the merchant' })
  @OneToMany(() => Product, (product) => product.merchant)
  products: Product[];

  @ApiProperty({ type: () => [Prescription], description: 'Prescriptions for the merchant' })
  @OneToMany(() => Prescription, (prescription) => prescription.merchant)
  prescriptions: Prescription[];

  @ApiProperty({ type: () => Area, description: 'Area of the merchant', required: false })
  @ManyToOne(() => Area, (area) => area.merchants, { nullable: true })
  area: Area;

  @ApiProperty({ type: () => [Blog], description: 'Blogs by the merchant' })
  @OneToMany(() => Blog, (blog) => blog.merchant)
  blogs: Blog[];

  @ApiProperty({ type: () => [Offer], description: 'Offers by the merchant' })
  @OneToMany(() => Offer, (offer) => offer.merchant)
  offers: Offer[];

  @ApiProperty({ type: () => [MerchantSubscription], description: 'Subscriptions of the merchant' })
  @OneToMany(() => MerchantSubscription, (subscription) => subscription.merchant)
  subscriptions: MerchantSubscription[];

  @ApiProperty({ type: () => City, description: 'City of the merchant', required: false })
  @ManyToOne(() => City, (city) => city.merchants, { nullable: true })
  city: City;
}
