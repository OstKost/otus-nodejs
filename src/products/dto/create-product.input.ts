import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  ownerId: number;

  @Field(() => Int, { nullable: true })
  orderId?: number;

  @Field({ defaultValue: false })
  published: boolean;

  @Field({ defaultValue: false })
  sold: boolean;
}
