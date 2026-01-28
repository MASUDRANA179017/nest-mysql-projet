import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  service: string;

  @ApiProperty()
  bookingDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;
}
