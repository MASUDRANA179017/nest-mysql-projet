import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateInvoiceDto {
    @ApiProperty({ description: 'Customer User ID', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @ApiProperty({ description: 'Store ID', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    storeId: number;

    @ApiProperty({ description: 'Order ID (optional)', example: 1, required: false })
    @IsNumber()
    @IsOptional()
    orderId?: number;

    @ApiProperty({ description: 'Subtotal amount', example: 100.00 })
    @IsNumber()
    @IsNotEmpty()
    subtotal: number;

    @ApiProperty({ description: 'Tax amount', example: 10.00, required: false })
    @IsNumber()
    @IsOptional()
    taxAmount?: number;

    @ApiProperty({ description: 'Discount amount', example: 5.00, required: false })
    @IsNumber()
    @IsOptional()
    discountAmount?: number;

    @ApiProperty({ description: 'Notes', example: 'Thank you for your purchase', required: false })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ description: 'Due date', example: '2025-12-15', required: false })
    @IsDateString()
    @IsOptional()
    dueDate?: string;
}

