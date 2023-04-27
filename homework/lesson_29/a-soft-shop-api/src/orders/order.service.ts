import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderInput: CreateOrderInput): Promise<Order> {
    return this.prisma.order.create({
      data: createOrderInput,
    });
  }

  async findAll(filter = {}): Promise<Order[]> {
    return this.prisma.order.findMany({ where: filter });
  }

  async findOne(id: number): Promise<Order> {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateOrderInput: UpdateOrderInput): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderInput,
    });
  }

  async remove(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
