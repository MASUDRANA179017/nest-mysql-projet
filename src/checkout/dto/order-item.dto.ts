import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID in the order item',
    example: 101,
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Service Date (for appointments)',
    example: '2024-12-25T10:00:00Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  serviceDate?: Date;
}
