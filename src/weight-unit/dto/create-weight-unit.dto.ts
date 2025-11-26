import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateWeightUnitDto {
    @ApiProperty({
        description: 'Weight unit name',
        example: 'Kilogram',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Description about the weight unit',
        example: 'Used for heavy products',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
}
