import { ApiProperty } from '@nestjs/swagger';

export class CreateLoyaltyDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  points: number;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  createdAt: Date;
}
