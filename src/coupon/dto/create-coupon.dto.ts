import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsArray } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ description: 'The coupon code', example: 'SUMMER2025' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Discount type', enum: ['FIXED', 'PERCENTAGE'], example: 'PERCENTAGE' })
  @IsEnum(['FIXED', 'PERCENTAGE'])
  discountType: 'FIXED' | 'PERCENTAGE';

  @ApiProperty({ description: 'Discount value', example: 20 })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiProperty({ description: 'Coupon scope', enum: ['PRODUCT', 'CATEGORY', 'FLAT'], example: 'PRODUCT' })
  @IsEnum(['PRODUCT', 'CATEGORY', 'FLAT'])
  scope: 'PRODUCT' | 'CATEGORY' | 'FLAT';

  @ApiProperty({ description: 'Store ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  storeId: number;

  @ApiProperty({ description: 'Product IDs (if scope is PRODUCT)', required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  productIds?: number[];

  @ApiProperty({ description: 'Category IDs (if scope is CATEGORY)', required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  categoryIds?: number[];

  @ApiProperty({ description: 'Expiration date (optional)', required: false })
  @IsOptional()
  expiresAt?: string;

  @ApiProperty({ description: 'User ID of store owner', example: 1 })
  @IsInt()
  userId: number;
}
