import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { UserService } from '../users/user.service';
import { ProductService } from '../products/product.service';

@Module({
  providers: [
    OrderResolver,
    OrderService,
    PrismaService,
    UserService,
    ProductService,
  ],
})
export class OrderModule {}
