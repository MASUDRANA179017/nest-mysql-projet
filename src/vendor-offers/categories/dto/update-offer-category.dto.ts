import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateOfferCategoryDto } from './create-offer-category.dto';
import { IsOptional } from 'class-validator';

export class UpdateOfferCategoryDto extends PartialType(CreateOfferCategoryDto) {
	@ApiProperty({ example: 1, description: 'The merchant/vendor id who owns this category', required: false })
	@IsOptional()
	merchantId?: number;
}
