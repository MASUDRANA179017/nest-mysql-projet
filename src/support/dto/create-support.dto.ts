import { ApiProperty } from '@nestjs/swagger';

export class CreateSupportDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  closedAt: Date;
}
