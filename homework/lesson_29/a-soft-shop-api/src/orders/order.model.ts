import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Order as OrderPrisma } from '@prisma/client';
import { Product } from '../products/product.model';
import { User } from '../users/user.model';

@ObjectType()
export class Order implements OrderPrisma {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  price: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  productId: number;

  @Field()
  ownerId: number;

  @Field()
  buyerId: number;

  @Field(() => Product)
  product: Product;

  @Field(() => User, { nullable: true })
  owner: User;

  @Field(() => User, { nullable: true })
  buyer: User;
}
