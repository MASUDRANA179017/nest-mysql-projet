import { ApiProperty } from "@nestjs/swagger";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {

  @ApiProperty({
    description: 'The name of the customer',
    example: "John Doe",
    required: false
  })
  customerName?: string;

  @ApiProperty({
    description: 'The phone number of the customer',
    example: "+1234567890",
    required: false
  })
  customerPhone?: string;

  @ApiProperty({
    description: 'Special instructions or notes',
    example: "Ring the bell",
    required: false
  })
  notes?: string;

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
