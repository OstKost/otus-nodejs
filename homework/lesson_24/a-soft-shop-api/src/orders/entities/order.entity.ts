import { Order } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class OrderEntity implements Order {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiProperty({ required: true })
  price: number;

  @ApiProperty()
  ownerId: number;

  @ApiProperty()
  buyerId: number;
}
