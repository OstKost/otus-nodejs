import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderLoader {
  constructor(private readonly prisma: PrismaService) {}

  async batchOrders(orderIds: readonly number[]): Promise<Order[]> {
    const ids = [...orderIds]; // преобразование в изменяемый массив
    return this.prisma.order.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
