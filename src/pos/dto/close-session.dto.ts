import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CloseSessionDto {
    @ApiProperty({ description: 'Closing cash balance', example: 500.00 })
    @IsNumber()
    @IsNotEmpty()
    closingBalance: number;

    @ApiProperty({ description: 'Closing notes', example: 'All cash counted', required: false })
    @IsString()
    @IsOptional()
    closingNotes?: string;
}

