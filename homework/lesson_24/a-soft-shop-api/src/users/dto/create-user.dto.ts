import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: false })
  phone: string;

  @ApiProperty({ required: true })
  password: string;
}
