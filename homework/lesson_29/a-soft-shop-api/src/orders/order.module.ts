import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { UserService } from '../users/user.service';
import { ProductService } from '../products/product.service';
import { UserLoader } from '../users/user.loader';
import { ProductLoader } from '../products/product.loader';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader';

@Module({
  providers: [
    OrderResolver,
    OrderService,
    PrismaService,
    UserService,
    ProductService,
    UserLoader,
    ProductLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class OrderModule {}
