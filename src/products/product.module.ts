import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderService } from '../orders/order.service';
import { UserService } from '../users/user.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { OrderLoader } from '../orders/order.loader';
import { UserLoader } from '../users/user.loader';

@Module({
  providers: [
    ProductResolver,
    ProductService,
    PrismaService,
    OrderService,
    UserService,
    OrderLoader,
    UserLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class ProductModule {}
