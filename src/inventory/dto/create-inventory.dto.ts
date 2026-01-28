import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  change: number;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  createdAt: Date;
}
