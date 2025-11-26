import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
  @ApiProperty({ example: "Apple" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Top quality electronics brand" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: "http://localhost:8000/uploads/brands/apple.jpg",
  })
  @IsString()
  @IsOptional()
  brandThumbnail?: string;
}
