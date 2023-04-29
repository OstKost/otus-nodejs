import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from './order.model';
import { Order as OrderPrisma } from '@prisma/client';
import { Product } from '../products/product.model';
import { User } from '../users/user.model';
import { Loader } from 'nestjs-dataloader';
import DataLoader from 'dataloader';
import { ProductLoader } from '../products/product.loader';
import { UserLoader } from '../users/user.loader';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Mutation(() => Order, { name: 'createOrder' })
  async createOrder(
    @Args('data') data: CreateOrderInput,
  ): Promise<OrderPrisma> {
    return this.orderService.create(data);
  }

  @Query(() => [Order], { name: 'orders' })
  async findAll(): Promise<OrderPrisma[]> {
    return this.orderService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  async findOne(@Args('id') id: number): Promise<OrderPrisma> {
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order, { name: 'updateOrder' })
  async updateOrder(
    @Args('id') id: number,
    @Args('data') data: UpdateOrderInput,
  ): Promise<OrderPrisma> {
    return this.orderService.update(id, data);
  }

  @Mutation(() => Order, { name: 'deleteOrder' })
  async deleteOrder(@Args('id') id: number): Promise<OrderPrisma> {
    return this.orderService.remove(id);
  }

  @ResolveField(() => Product)
  async product(
    @Parent() order: OrderPrisma,
    @Loader(ProductLoader) productLoader: DataLoader<Product['id'], Product>,
  ) {
    const { productId } = order;
    return productLoader.load(productId);
  }

  @ResolveField(() => User)
  async owner(
    @Parent() order: OrderPrisma,
    @Loader(UserLoader) userLoader: DataLoader<User['id'], User>,
  ) {
    const { ownerId } = order;
    return userLoader.load(ownerId);
  }

  @ResolveField(() => User)
  async buyer(
    @Parent() order: OrderPrisma,
    @Loader(UserLoader) userLoader: DataLoader<User['id'], User>,
  ) {
    const { buyerId } = order;
    return buyerId ? userLoader.load(buyerId) : null;
  }
}
