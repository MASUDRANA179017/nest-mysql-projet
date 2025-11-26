import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateWeightUnitDto {
    @ApiProperty({
        description: 'Weight unit name',
        example: 'Gram',
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Description about the weight unit',
        example: 'Used for small products',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
}
