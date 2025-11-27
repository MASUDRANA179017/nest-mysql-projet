import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString, IsArray, ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class UpdatePrescriptionDto {
    @ApiProperty({ description: 'Title', example: 'Evening Medicine', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ description: 'Description', example: 'Take before sleep', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Note', example: 'Monitor sugar level', required: false })
    @IsString()
    @IsOptional()
    note?: string;

    @ApiProperty({ description: 'Advice', example: 'Exercise daily', required: false })
    @IsString()
    @IsOptional()
    advice?: string;

    @ApiProperty({ description: 'Visiting date', example: '2025-11-28', required: false })
    @IsDateString()
    @IsOptional()
    visitingDate?: string;

    @ApiProperty({ description: 'Next visiting date', example: '2025-12-05', required: false })
    @IsDateString()
    @IsOptional()
    nextVisitingDate?: string;

    @ApiProperty({ description: "Store ID of the vendor", example: 1 })
    @IsNotEmpty()
    @IsNumber()
    storeId: number;

    @ApiProperty({ description: 'Owner User ID', example: 1, required: false })
    @IsNumber()
    @IsOptional()
    ownerId?: number;

    @ApiProperty({ description: 'Array of Product IDs', example: [1, 2, 3], required: false })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    @IsOptional()
    productIds?: number[];
}
