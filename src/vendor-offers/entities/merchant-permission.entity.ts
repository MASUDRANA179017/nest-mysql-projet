import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Merchant } from './merchant.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('merchant_permissions')
export class MerchantPermission {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column()
  merchantId: number;

  @ManyToOne(() => Merchant, (merchant) => merchant.id)
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  @ApiProperty({ example: 'products', description: 'Module name' })
  @Column({ length: 50 })
  module: string;

  @ApiProperty({ example: true, description: 'Can access this module' })
  @Column({ default: false })
  canAccess: boolean;
}
