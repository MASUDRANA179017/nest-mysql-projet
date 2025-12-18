import { ApiProperty } from "@nestjs/swagger";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {

  @ApiProperty({
    description: 'The shipping address of the order',
    example: "Nikunjo Dhaka Bangladesh"
  })
  shippingAddress: string;

  @ApiProperty({
    description: 'List of items in the order',
    type: [OrderItemDto],
  })
  items: OrderItemDto[];
}
