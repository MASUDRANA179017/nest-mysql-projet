import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateStoreDto {
    @ApiProperty({
        description: "The name of the store",
        example: "My Updated Store",
        required: false
    })
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({
        description: "A brief description of the store",
        example: "This store now sells even more awesome products.",
        required: false
    })
    @IsString()
    @IsNotEmpty()
    description?: string;
    @ApiProperty({
        description: "Store Image URL",
        example: "https://example.com/updated-store-image.jpg",
        required: false
    })
    @IsString()
    imageUrl?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    smtpHost?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    smtpPort?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    smtpUser?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    smtpPass?: string;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    smtpSecure?: boolean;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    smtpFrom?: string;
}

