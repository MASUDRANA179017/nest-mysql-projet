import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  sentAt: Date;
}
