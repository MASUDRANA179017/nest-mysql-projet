import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateProductDto {
  
  @ApiProperty({ description: "Product name", example: "Laptop" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: "Product description", example: "A high-performance laptop" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Product price", example: 999 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ description: "Product stock", example: 100 })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ description: "Manufacturing date", example: "2024-01-15" })
  @IsDateString()
  @IsOptional()
  manufactureDate?: Date;

  @ApiProperty({ description: "Expiry date", example: "2026-01-15" })
  @IsDateString()
  @IsOptional()
  expireDate?: Date;

  @ApiProperty({ description: "Store ID", example: 1 })
  @IsNumber()
  @IsOptional()
  storeId?: number;

  @ApiProperty({ description: "Category ID", example: 2 })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ description: "Brand ID", example: 3 })
  @IsNumber()
  @IsOptional()
  brandId?: number;

  @ApiProperty({ description: "Weight Unit ID", example: 4 })
  @IsNumber()
  @IsOptional()
  weightUnitId?: number;

  @ApiProperty({
    description: "Thumbnail image URL",
    example: "http://localhost:8000/uploads/products/thumbnail.jpg",
  })
  @IsString()
  @IsOptional()
  productThumbnail?: string;

  @ApiProperty({
    description: "Array of product gallery images",
    example: [
      "http://localhost:8000/uploads/products/gallery1.jpg",
      "http://localhost:8000/uploads/products/gallery2.jpg"
    ],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  productGallery?: string[];
}
