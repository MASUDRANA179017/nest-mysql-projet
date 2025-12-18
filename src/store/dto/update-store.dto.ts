import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateStoreDto {
    @ApiProperty({ description: "Store name", required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: "Store description", required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: "Store Image URL", required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty({ description: "Store Cover Image URL", required: false })
    @IsString()
    @IsOptional()
    coverImage?: string;

    @ApiProperty({ description: "SMTP Host", required: false })
    @IsString()
    @IsOptional()
    smtpHost?: string;

    @ApiProperty({ description: "SMTP Port", required: false })
    @IsNumber()
    @IsOptional()
    smtpPort?: number;

    @ApiProperty({ description: "SMTP User", required: false })
    @IsString()
    @IsOptional()
    smtpUser?: string;

    @ApiProperty({ description: "SMTP Password", required: false })
    @IsString()
    @IsOptional()
    smtpPass?: string;

    @ApiProperty({ description: "SMTP Secure", required: false })
    @IsBoolean()
    @IsOptional()
    smtpSecure?: boolean;

    @ApiProperty({ description: "SMTP From Email", required: false })
    @IsString()
    @IsOptional()
    smtpFrom?: string;
}
