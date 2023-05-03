import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';
import * as DataLoader from 'dataloader';

@Injectable()
export class OrderLoader implements NestDataLoader<number, Order> {
  constructor(private readonly prismaService: PrismaService) {}

  generateDataLoader(): DataLoader<number, Order> {
    return new DataLoader<number, Order>(
      async (orderIds: readonly number[]) => {
        const orders = await this.prismaService.order.findMany({
          where: { id: { in: [...orderIds] } },
        });
        const orderMap = new Map(orders.map((order) => [order.id, order]));
        return orderIds.map((id) => orderMap.get(id));
      },
    );
  }
}
