import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductLoader {
  constructor(private prisma: PrismaService) {}

  async load(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }
}
