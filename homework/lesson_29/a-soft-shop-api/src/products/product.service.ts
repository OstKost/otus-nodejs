import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    return this.prisma.product.create({
      data: createProductInput,
    });
  }

  async findAll(filter = {}): Promise<Product[]> {
    return this.prisma.product.findMany({ where: filter });
  }

  async findOne(id: number): Promise<Product> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: updateProductInput,
    });
  }

  async remove(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
