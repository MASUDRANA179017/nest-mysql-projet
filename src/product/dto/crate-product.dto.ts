import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Min, IsArray, ArrayNotEmpty, IsDateString } from "class-validator";

export class CreateProductDto {
  
  @ApiProperty({ description: "The name of the product", example: "Laptop" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Product description", example: "A high-performance laptop" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Product price", example: 999 })
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({ description: "Product stock", example: 100 })
  @IsNotEmpty()
  @Min(0)
  stock: number;

  @ApiProperty({ description: "Manufacturing date", example: "2024-01-15", required: false })
  @IsOptional()
  @IsDateString()
  manufactureDate?: Date;

  @ApiProperty({ description: "Expiry date", example: "2026-01-15", required: false })
  @IsOptional()
  @IsDateString()
  expireDate?: Date;

  @ApiProperty({ description: "Store ID of the vendor", example: 1 })
  @IsNotEmpty()
  storeId: number;

  @ApiProperty({ description: "Category ID", example: 1 })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ description: "Brand ID", example: 3, required: false })
  @IsOptional()
  brandId?: number;

  @ApiProperty({ description: "Weight Unit ID", example: 2, required: false })
  @IsOptional()
  weightUnitId?: number;

  @ApiProperty({ description: "Is this a service?", example: true, required: false })
  @IsOptional()
  isService?: boolean;

  @ApiProperty({
    description: "Thumbnail image URL",
    example: "http://localhost:8000/uploads/products/file-1761926804589-16322692.jpg",
  })
  @IsString()
  @IsNotEmpty()
  productThumbnail: string;

  @ApiProperty({
    description: "Product gallery images",
    example: [
      "http://localhost:8000/uploads/products/gallery1.jpg",
      "http://localhost:8000/uploads/products/gallery2.jpg"
    ],
    isArray: true,
    type: String,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productGallery: string[];
}
