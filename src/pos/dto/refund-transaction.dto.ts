import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RefundTransactionDto {
    @ApiProperty({ description: 'Refund reason', example: 'Customer returned item', required: false })
    @IsString()
    @IsOptional()
    reason?: string;
}

