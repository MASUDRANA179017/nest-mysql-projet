import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOfferCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'The name of the category' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'icon-url', description: 'The icon URL of the category', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: 1, description: 'The merchant/vendor id who owns this category' })
  @IsNotEmpty()
  merchantId: number;
}
