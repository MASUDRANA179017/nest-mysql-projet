import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreatePrescriptionDto {
    @ApiProperty({ description: 'Title of the prescription', example: 'Morning Medicine' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Description', example: 'Take after meal', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Note', example: 'Check blood pressure', required: false })
    @IsString()
    @IsOptional()
    note?: string;

    @ApiProperty({ description: 'Advice', example: 'Drink water', required: false })
    @IsString()
    @IsOptional()
    advice?: string;

    @ApiProperty({ description: 'Visiting date', example: '2025-11-27', required: false })
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
    ownerId: number;

    @ApiProperty({ description: 'Array of Product IDs', example: [1, 2, 3] })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    productIds: number[];
}
