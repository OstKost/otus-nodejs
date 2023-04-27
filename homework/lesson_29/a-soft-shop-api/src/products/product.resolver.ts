import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './product.model';
import { Product as ProductPrisma } from '@prisma/client';
import { User } from '../users/user.model';
import { OrderService } from '../orders/order.service';
import { UserService } from '../users/user.service';
import { Order } from '../orders/order.model';
import { Loader } from 'nestjs-dataloader/dist';
import { UserLoader } from '../users/user.loader';
import DataLoader from 'dataloader';
import { OrderLoader } from '../orders/order.loader';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  @Mutation(() => Product, { name: 'createProduct' })
  async createProduct(
    @Args('data') data: CreateProductInput,
  ): Promise<ProductPrisma> {
    return this.productService.create(data);
  }

  @Query(() => [Product], { name: 'products' })
  async findAll(): Promise<ProductPrisma[]> {
    return this.productService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  async findOne(@Args('id') id: number): Promise<ProductPrisma> {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product, { name: 'updateProduct' })
  async updateProduct(
    @Args('id') id: number,
    @Args('data') data: UpdateProductInput,
  ): Promise<ProductPrisma> {
    return this.productService.update(id, data);
  }

  @Mutation(() => Product, { name: 'deleteProduct' })
  async deleteProduct(@Args('id') id: number): Promise<ProductPrisma> {
    return this.productService.remove(id);
  }

  @ResolveField(() => Order)
  async order(
    @Parent() product: ProductPrisma,
    @Loader(OrderLoader) orderLoader: DataLoader<Order['id'], Order>,
  ) {
    const { orderId } = product;
    return orderId ? orderLoader.load(orderId) : null;
  }

  @ResolveField(() => User)
  async owner(
    @Parent() product: ProductPrisma,
    @Loader(UserLoader) userLoader: DataLoader<User['id'], User>,
  ) {
    const { ownerId } = product;
    return userLoader.load(ownerId);
  }
}
