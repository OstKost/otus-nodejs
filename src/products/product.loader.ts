import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader';
import { PrismaService } from '../prisma/prisma.service';
import { default as DataLoader } from 'dataloader';
import { Product } from '@prisma/client';

@Injectable()
export class ProductLoader implements NestDataLoader<number, Product> {
  constructor(private readonly prismaService: PrismaService) {}

  generateDataLoader(): DataLoader<number, Product> {
    return new DataLoader<number, Product>(
      async (productIds: readonly number[]) => {
        const products = await this.prismaService.product.findMany({
          where: { id: { in: [...productIds] } },
        });
        const productsMap = new Map(
          products.map((product) => [product.id, product]),
        );
        return productIds.map((id) => productsMap.get(id));
      },
    );
  }
}
