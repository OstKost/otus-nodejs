import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class ProductInput {
  @Field(() => Int)
  id: number;
}
