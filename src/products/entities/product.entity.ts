import { Product } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity implements Product {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: false, nullable: true })
  content: string | null;

  @ApiProperty({ required: true })
  price: number;

  @ApiProperty()
  ownerId: number;

  @ApiProperty()
  orderId: number | null;

  @ApiProperty({ required: false, nullable: true })
  published: boolean | null;

  @ApiProperty({ required: false, nullable: true })
  sold: boolean | null;
}
