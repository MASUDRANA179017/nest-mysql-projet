import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OpenSessionDto {
    @ApiProperty({ description: 'Store ID', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    storeId: number;

    @ApiProperty({ description: 'Opening cash balance', example: 100.00 })
    @IsNumber()
    @IsNotEmpty()
    openingBalance: number;
}

