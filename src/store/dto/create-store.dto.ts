import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsOptional } from "class-validator"

export class CreateStoreDto {
    @ApiProperty({

        description: "The name of the store",
        example: "My Awesome Store"
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: "A brief description of the store",
        example: "This store sells awesome products."
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: "Store Image URL",
        example: "https://example.com/store-image.jpg",
        required: false
    })
    @IsString()
    imageUrl: string;

    @ApiProperty({ description: "Address", example: "123 Main St", required: false })
    @IsOptional()
    @IsString()
    address: string;

    @ApiProperty({ description: "City", example: "New York", required: false })
    @IsOptional()
    @IsString()
    city: string;

    @ApiProperty({
        description: "The category ID (Vendor Type)",
        example: 1,
        required: false
    })
    @IsOptional()
    categoryId: number;

}



