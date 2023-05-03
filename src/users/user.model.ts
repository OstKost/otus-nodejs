import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  ResolveField,
} from '@nestjs/graphql';
import { User as UserPrisma } from '@prisma/client';
import { Order } from '../orders/order.model';
import { Product } from '../products/product.model';

@ObjectType()
export class User implements UserPrisma {
  @Field(() => ID)
  id: number;

  @Field()
  name: string | null;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Role)
  role: Role;

  @Field(() => [Product], { nullable: true })
  products?: Product[];

  @Field(() => [Order], { nullable: true })
  sales?: Order[];

  @Field(() => [Order], { nullable: true })
  purchases?: Order[];

  password: string;
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User roles',
});
