import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ required: true })
  productId: number;

  @ApiProperty({ required: true })
  price: number;

  @ApiProperty({ required: true })
  ownerId: number;

  @ApiProperty({ required: true })
  buyerId: number;
}
