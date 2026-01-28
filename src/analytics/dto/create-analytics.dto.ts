import { ApiProperty } from '@nestjs/swagger';

export class CreateAnalyticsDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  data: string;

  @ApiProperty()
  generatedAt: Date;
}
