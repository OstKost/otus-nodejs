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
import { UserService } from '../users/user.service';
import { ProductService } from '../products/product.service';
import { User } from '../users/user.model';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

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
  async product(@Parent() order: OrderPrisma) {
    const { id } = order;
    return this.productService.findOne(id);
  }

  @ResolveField(() => User)
  async owner(@Parent() order: OrderPrisma) {
    const { ownerId } = order;
    return this.userService.getUserById(ownerId);
  }

  @ResolveField(() => User)
  async buyer(@Parent() order: OrderPrisma) {
    const { buyerId } = order;
    return this.userService.getUserById(buyerId);
  }
}
