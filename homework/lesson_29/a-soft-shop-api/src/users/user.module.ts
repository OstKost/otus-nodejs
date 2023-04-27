import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { ProductService } from '../products/product.service';
import { OrderService } from '../orders/order.service';

@Module({
  providers: [
    UserService,
    UserResolver,
    PrismaService,
    ProductService,
    OrderService,
  ],
})
export class UserModule {}
