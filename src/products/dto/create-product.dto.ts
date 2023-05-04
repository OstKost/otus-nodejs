import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: false, default: null })
  content: string;

  @ApiProperty({ required: true })
  price: number;

  @ApiProperty({ required: true })
  ownerId: number;
}
