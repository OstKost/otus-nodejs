import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ required: false })
  orderId: number;

  @ApiProperty({ required: false, default: false })
  published: boolean;

  @ApiProperty({ required: false, default: false })
  sold: boolean;
}
