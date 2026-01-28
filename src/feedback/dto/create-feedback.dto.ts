import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  targetId: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  createdAt: Date;
}
