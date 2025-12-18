import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class ApplyCouponDto {
  @ApiProperty({ description: 'Coupon code', example: 'SUMMER2025' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Store ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  storeId: number;

  @ApiProperty({ type: [CartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
