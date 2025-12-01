import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { InvoiceStatus } from 'src/entity/invoice.entity';

export class UpdateInvoiceDto {
    @ApiProperty({ description: 'Tax amount', required: false })
    @IsNumber()
    @IsOptional()
    taxAmount?: number;

    @ApiProperty({ description: 'Discount amount', required: false })
    @IsNumber()
    @IsOptional()
    discountAmount?: number;

    @ApiProperty({ description: 'Invoice status', enum: InvoiceStatus, required: false })
    @IsEnum(InvoiceStatus)
    @IsOptional()
    status?: InvoiceStatus;

    @ApiProperty({ description: 'Notes', required: false })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ description: 'Due date', required: false })
    @IsDateString()
    @IsOptional()
    dueDate?: string;
}

