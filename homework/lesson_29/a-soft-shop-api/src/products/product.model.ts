import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Product as ProductPrisma } from '@prisma/client';
import { User } from '../users/user.model';
import { Order } from '../orders/order.model';

@ObjectType()
export class Product implements ProductPrisma {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  content: string;

  @Field(() => Int)
  price: number;

  @Field(() => ID, { nullable: true })
  orderId: number | null;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => Boolean)
  sold: boolean;

  @Field()
  ownerId: number;

  @Field(() => Order, { nullable: true })
  order: Order;

  @Field(() => User)
  owner: User;
}
