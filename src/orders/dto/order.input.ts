import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class OrderInput {
  @Field()
  id: number;
}
