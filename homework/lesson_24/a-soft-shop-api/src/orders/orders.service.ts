import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  userFields = {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  };

  create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    return this.prisma.order.create({
      data: {
        product: { connect: { id: createOrderDto.productId } },
        price: createOrderDto.price,
        owner: { connect: { id: createOrderDto.ownerId } },
        buyer: { connect: { id: createOrderDto.buyerId } },
      },
      include: {
        product: true,
        owner: this.userFields,
        buyer: this.userFields,
      },
    });
  }

  findAll(): Promise<OrderEntity[]> {
    return this.prisma.order.findMany({
      include: {
        product: true,
        owner: this.userFields,
        buyer: this.userFields,
      },
    });
  }

  findOne(id: number): Promise<OrderEntity> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        product: true,
        owner: this.userFields,
        buyer: this.userFields,
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    return this.prisma.order.update({
      where: { id },
      data: {
        product: { connect: { id: updateOrderDto.productId } },
        price: updateOrderDto.price,
        owner: { connect: { id: updateOrderDto.ownerId } },
        buyer: { connect: { id: updateOrderDto.buyerId } },
      },
      include: {
        product: true,
        owner: this.userFields,
        buyer: this.userFields,
      },
    });
  }

  remove(id: number): Promise<OrderEntity> {
    return this.prisma.order.delete({
      where: { id },
      include: {
        product: true,
        owner: this.userFields,
        buyer: this.userFields,
      },
    });
  }
}
