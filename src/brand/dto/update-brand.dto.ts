import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateBrandDto {
  @ApiProperty({ example: "Apple" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: "Updated brand description" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: "http://localhost:8000/uploads/brands/apple-new.jpg",
  })
  @IsString()
  @IsOptional()
  brandThumbnail?: string;
}
