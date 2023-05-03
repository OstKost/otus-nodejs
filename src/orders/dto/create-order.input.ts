import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  productId: number;

  @Field()
  price: number;

  @Field()
  ownerId: number;

  @Field()
  buyerId: number;
}
