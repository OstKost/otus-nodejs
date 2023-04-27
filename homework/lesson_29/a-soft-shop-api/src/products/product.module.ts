import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderService } from '../orders/order.service';
import { UserService } from '../users/user.service';

@Module({
  providers: [
    ProductResolver,
    ProductService,
    PrismaService,
    OrderService,
    UserService,
  ],
})
export class ProductModule {}
