import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { ProductService } from '../products/product.service';
import { OrderService } from '../orders/order.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader/dist';
import { OrderLoader } from '../orders/order.loader';
import { ProductLoader } from '../products/product.loader';

@Module({
  providers: [
    UserService,
    UserResolver,
    PrismaService,
    ProductService,
    OrderService,
    OrderLoader,
    ProductLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
