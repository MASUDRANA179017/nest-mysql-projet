import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description: "The name of the category",
        example: "Electronics",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

   
    @ApiProperty({
        description: "The description of the category",
        example: "Devices and gadgets",
    })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({
        description: "The parent category ID (for sub-categories)",
        example: 1,
        required: false
    })
    @IsOptional()
    parentId: number;

    @ApiProperty({
        description: "The store ID (for vendor-specific categories)",
        example: 1,
        required: false
    })
    @IsOptional()
    storeId?: number;
}
