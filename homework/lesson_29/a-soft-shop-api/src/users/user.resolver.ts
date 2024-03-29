import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './user.service';
import { User } from './user.model';
import { Role, User as UserPrisma } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProductService } from '../products/product.service';
import { OrderService } from '../orders/order.service';
import { Product } from '../products/product.model';
import { Order } from '../orders/order.model';
import { Loader } from 'nestjs-dataloader/dist';
import { OrderLoader } from '../orders/order.loader';
import DataLoader from 'dataloader';
import { ProductLoader } from '../products/product.loader';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
  ) {}

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin)
  async createUser(@Args('data') data: CreateUserInput): Promise<UserPrisma> {
    return this.userService.createUser(data);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  async getUser(@Args('id') id: number): Promise<UserPrisma> {
    return this.userService.getUserById(id);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<UserPrisma[]> {
    return this.userService.getAllUsers();
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('id') id: number,
    @Args('data') data: UpdateUserInput,
  ): Promise<UserPrisma> {
    return this.userService.updateUser(id, data);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin)
  async deleteUser(@Args('id') id: number): Promise<UserPrisma> {
    return this.userService.deleteUser(id);
  }

  @ResolveField(() => Product)
  async products(
    @Parent() user: UserPrisma,
    @Loader(ProductLoader) productLoader: DataLoader<Product['id'], Product>,
  ) {
    const { id } = user;
    const products = await this.productService.findAll({ ownerId: id });
    return productLoader.loadMany(products.map(({ id }) => id));
  }

  @ResolveField(() => Order)
  async sales(
    @Parent() user: UserPrisma,
    @Loader(OrderLoader) orderLoader: DataLoader<Order['id'], Order>,
  ) {
    const { id } = user;
    const orders = await this.orderService.findAll({ ownerId: id });
    return orderLoader.loadMany(orders.map(({ id }) => id));
  }

  @ResolveField(() => Order)
  async purchases(
    @Parent() user: UserPrisma,
    @Loader(OrderLoader) orderLoader: DataLoader<Order['id'], Order>,
  ) {
    const { id } = user;
    const orders = await this.orderService.findAll({ buyerId: id });
    return orderLoader.loadMany(orders.map(({ id }) => id));
  }
}
