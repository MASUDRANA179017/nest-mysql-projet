import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliveryDto {
  @ApiProperty()
  orderId: number;

  @ApiProperty()
  deliveryStatus: string;

  @ApiProperty()
  trackingNumber: string;

  @ApiProperty()
  shippedAt: Date;

  @ApiProperty()
  deliveredAt: Date;
}
