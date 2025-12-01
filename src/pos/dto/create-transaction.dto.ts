import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from 'src/entity/pos-transaction.entity';

export class TransactionItemDto {
    @ApiProperty({ description: 'Product ID', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @ApiProperty({ description: 'Quantity', example: 2 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateTransactionDto {
    @ApiProperty({ description: 'POS Session ID', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    sessionId: number;

    @ApiProperty({ description: 'Customer ID (optional)', example: 1, required: false })
    @IsNumber()
    @IsOptional()
    customerId?: number;

    @ApiProperty({ description: 'Transaction items', type: [TransactionItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TransactionItemDto)
    items: TransactionItemDto[];

    @ApiProperty({ description: 'Discount amount', example: 5.00, required: false })
    @IsNumber()
    @IsOptional()
    discountAmount?: number;

    @ApiProperty({ description: 'Tax amount', example: 10.00, required: false })
    @IsNumber()
    @IsOptional()
    taxAmount?: number;

    @ApiProperty({ description: 'Payment method', enum: PaymentMethod, example: 'cash' })
    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    paymentMethod: PaymentMethod;

    @ApiProperty({ description: 'Amount paid by customer', example: 50.00 })
    @IsNumber()
    @IsNotEmpty()
    amountPaid: number;

    @ApiProperty({ description: 'Notes', example: 'Regular customer', required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}

